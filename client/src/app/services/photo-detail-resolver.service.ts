import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Photo } from '../models/photo.model';
import { PhotosService } from './photos.service';


@Injectable()
export class PhotoDetailResolverService implements Resolve<Photo> {

  constructor(
    private photosService: PhotosService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any> {

    return this.photosService.get(route.params['slug'])
    .pipe(catchError(() => this.router.navigateByUrl('/')));

  }

}
