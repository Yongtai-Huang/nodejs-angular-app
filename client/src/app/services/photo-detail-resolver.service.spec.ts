import { TestBed, inject } from '@angular/core/testing';

import { PhotoDetailResolverService } from './photo-detail-resolver.service';

describe('PhotoDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoDetailResolverService]
    });
  });

  it('should be created', inject([PhotoDetailResolverService], (service: PhotoDetailResolverService) => {
    expect(service).toBeTruthy();
  }));
});
