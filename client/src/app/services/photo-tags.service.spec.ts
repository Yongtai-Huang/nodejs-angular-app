import { TestBed, inject } from '@angular/core/testing';

import { PhotoTagsService } from './photo-tags.service';

describe('PhotoTagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoTagsService]
    });
  });

  it('should be created', inject([PhotoTagsService], (service: PhotoTagsService) => {
    expect(service).toBeTruthy();
  }));
});
