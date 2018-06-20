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

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

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
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
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

  // set code for account restoration
  // setCode(email) {
  //   return this.apiService
  //   .post('/users/code', email)
  //   .pipe(map( (data) => {
  //     return data; //userData: code, email
  //   }));
  // }
  //
  // resetPassword(credentials): Observable<User> {
  //   return this.apiService
  //   .post('/users/resetPassword', credentials)
  //   .pipe(map( (data) => {
  //     this.setAuth(data.user);
  //     return data;
  //   }));
  //
  // }

}
