import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '../models/profile.model';

@Injectable()
export class ProfileService {
  private currentProfileSubject = new BehaviorSubject<Profile>(new Profile());
  public currentprofile = this.currentProfileSubject.asObservable().pipe(distinctUntilChanged());

  constructor (
    private apiService: ApiService
  ) {}

  get(username: string): Observable<Profile> {
    return this.apiService.get('/profiles/' + username)
    .pipe(map((data: {profile: Profile}) => {
      this.setCurrentProfile(data.profile);
      return data.profile;
    }));
  }

  follow(username: string): Observable<Profile> {
    return this.apiService.post('/profiles/' + username + '/follow')
  }

  unfollow(username: string): Observable<Profile> {
    return this.apiService.delete('/profiles/' + username + '/follow')
  }

  setCurrentProfile(profile: Profile) {
    this.currentProfileSubject.next(profile);
  }

  getCurrentProfile(): Profile {
    return this.currentProfileSubject.value;
  }

}
