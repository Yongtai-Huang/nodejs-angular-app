import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) {}

  canActivate( ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));
  }

}
