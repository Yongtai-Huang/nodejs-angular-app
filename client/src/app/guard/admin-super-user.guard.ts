import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSuperUserGuard implements CanActivate {

  constructor(
    private userService: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //return true;
    if (this.userService.isAdmin.pipe(take(1))) {
      return true;
    } else if (this.userService.isSuperUser.pipe(take(1))) {
      return true;
    } else {
      return false;
    }
  }

}
