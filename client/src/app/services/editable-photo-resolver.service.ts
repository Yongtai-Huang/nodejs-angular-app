import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Photo } from '../models/photo.model';
import { PhotosService } from '../services/photos.service';
import { UserService } from '../services/user.service';

@Injectable()
export class EditablePhotoResolverService implements Resolve<Photo> {

  constructor(
    private photosService: PhotosService,
    private router: Router,
    private userService: UserService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.photosService.get(route.params['slug'])
      .pipe(
        map( (photo) => {
          if (this.userService.getCurrentUser().username === photo.takenBy.username) {
            return photo;
          } else {
            this.router.navigateByUrl('/');
          }
        }),
        catchError((err) => this.router.navigateByUrl('/'))
      );

  }

}
