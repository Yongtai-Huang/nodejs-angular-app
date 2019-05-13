import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(
    private profileService: ProfileService
  ) {}

  canActivate( ): Observable<boolean> | Promise<boolean> | boolean {
    return this.profileService.getCurrentProfile().yourself;
  }

}
