import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSuperAdminGuard implements CanActivate {

  constructor(
    private userService: UserService
  ) {}

  canActivate( ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userService.isAdmin.pipe(take(1))) {
      return true;
    } else if (this.userService.isSuperAdmin.pipe(take(1))) {
      return true;
    } else {
      return false;
    }
  }

}
