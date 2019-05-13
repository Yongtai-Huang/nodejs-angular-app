import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
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
    route: ActivatedRouteSnapshot
  ): Observable<any> {
    return this.photosService.get(route.params['slug'])
    .pipe(
      map( (photo) => {
        if (this.userService.getCurrentUser().username === photo.createdBy.username) {
          return photo;
        } else {
          this.router.navigateByUrl('/');
        }
      }),
      catchError( () => this.router.navigateByUrl('/'))
    );

  }

}
