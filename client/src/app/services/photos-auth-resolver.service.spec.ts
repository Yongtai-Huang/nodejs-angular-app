import { TestBed, inject } from '@angular/core/testing';

import { PhotosAuthResolverService } from './photos-auth-resolver.service';

describe('PhotosAuthResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotosAuthResolverService]
    });
  });

  it('should be created', inject([PhotosAuthResolverService], (service: PhotosAuthResolverService) => {
    expect(service).toBeTruthy();
  }));
});
