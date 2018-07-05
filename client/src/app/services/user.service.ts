import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { map, catchError, distinctUntilChanged } from 'rxjs/operators';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  // Logged in
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  // Admin
  private isAdminSubject = new ReplaySubject<boolean>(1);
  public isAdmin = this.isAdminSubject.asObservable();

  // Super user
  private isSuperUserSubject = new ReplaySubject<boolean>(1);
  public isSuperUser = this.isSuperUserSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  // verify JWT in localstorage with server & load user's info
  // run once on application startup
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('/user')
      .subscribe( data => this.setAuth(data.user), err => this.purgeAuth() );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    if (user.admin) {
      // Set admin
      this.isAdminSubject.next(true);
    } else {
      this.isAdminSubject.next(false);
    }

    if (user.superUser) {
      // Set superUser
      this.isSuperUserSubject.next(true);
    } else {
      this.isSuperUserSubject.next(false);
    }
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    //Set admin to false
    this.isAdminSubject.next(false);
    //Set superUser to false
    this.isSuperUserSubject.next(false);
  }

  attemptAuth(type, credentials): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post('/users' + route, credentials )
    .pipe(map( (data) => {
      this.setAuth(data.user);
      return data;
    }));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.apiService
    .get('/')
    .pipe(map( (data) => {
      return data.users; //usersData
    }));
  }

	// Add admin role to user
  addAdmin(username): Observable<User> {
    return this.apiService
    .post('/admin/' + username)
    .pipe(map(data => {
      return data.usr;
    }));
  }

	// Remove admin role from user
  removeAdmin(username): Observable<User> {
    return this.apiService
    .delete('/admin/' + username)
    .pipe(map(data => {
      return data.usr;
    }));
  }

  // update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', user)
    .pipe(map(data => {
      // update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }


}
