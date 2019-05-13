import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Photo } from '../models/photo.model';
import { PhotoListConfig } from '../models/photo-list-config.model';

@Injectable()
export class PhotosService {

  constructor(
    private apiService: ApiService
  ) { }

  query(config: PhotoListConfig): Observable<{photos: Photo[], photosCount: number}> {
    // Convert any filters over to Angular's HttpParams
    const params = {};
    Object.keys(config.filters)
    .forEach((key) => {
      params[key] = config.filters[key];
    });

    return this.apiService
    .get('/photos' + ((config.type === 'feed') ? '/feed' : ''), new HttpParams({ fromObject: params }));
  }

  get(slug: string): Observable<Photo> {
    return this.apiService.get('/photos/' + slug)
    .pipe(map(data => data.photo));
  }

  destroy(slug: string) {
    return this.apiService.delete('/photos/' + slug);
  }

  save(photo: FormData): Observable<Photo> {
    if (photo.get('slug')) {
      // update an existing photo
      return this.apiService.put('/photos/' + photo.get('slug'), photo)
      .pipe(map(data => data.photo));

    } else {
      // create a new photo
      return this.apiService.post('/photos/', photo)
      .pipe(map(data => data.photo));
    }
  }

  // upvote the photo
  upvote(slug: string): Observable<Photo> {
    return this.apiService.post('/photos/' + slug + '/upvote');
  }

  // cancel upvote
  unupvote(slug: string): Observable<Photo> {
    return this.apiService.delete('/photos/' + slug + '/upvote');
  }

  // downvote
  downvote(slug: string): Observable<Photo> {
    return this.apiService.post('/photos/' + slug + '/downvote');
  }

  // cancel downvote
  undownvote(slug: string): Observable<Photo> {
    return this.apiService.delete('/photos/' + slug + '/downvote');
  }

}
