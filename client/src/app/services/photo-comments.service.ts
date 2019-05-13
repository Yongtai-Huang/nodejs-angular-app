import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { PhotoComment } from '../models/photo-comment.model';

@Injectable()
export class PhotoCommentsService {

  constructor(
    private apiService: ApiService
  ) { }

  add(slug: string, payload: string): Observable<PhotoComment> {
    return this.apiService
    .post( `/photos/${slug}/photoComments`, { photoComment: { body: payload } } )
    .pipe(map(data => data.photoComment));
  }

  getAll(slug: string): Observable<PhotoComment[]> {
    return this.apiService.get(`/photos/${slug}/photoComments`)
    .pipe(map(data => data.photoComments));
  }

  destroy(photoCommentId: string, slug: string) {
    return this.apiService
    .delete(`/photos/${slug}/photoComments/${photoCommentId}`);
  }

}
