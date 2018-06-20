import { TestBed, inject } from '@angular/core/testing';

import { PhotoCommentsService } from './photo-comments.service';

describe('PhotoCommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoCommentsService]
    });
  });

  it('should be created', inject([PhotoCommentsService], (service: PhotoCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
