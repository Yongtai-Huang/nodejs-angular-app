import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class PhotoTagsService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<[string]> {
    return this.apiService.get('/photoTags')
    .pipe(map(data => data.tags));
  }

}
