import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable()
export class PhotosAuthResolverService implements Resolve<boolean>  {

  constructor(
    private userService: UserService
  ) { }

  resolve( ): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(take(1));
  }

}
