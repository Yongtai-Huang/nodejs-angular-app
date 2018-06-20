import { TestBed, inject } from '@angular/core/testing';

import { EditablePhotoResolverService } from './editable-photo-resolver.service';

describe('EditablePhotoResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditablePhotoResolverService]
    });
  });

  it('should be created', inject([EditablePhotoResolverService], (service: EditablePhotoResolverService) => {
    expect(service).toBeTruthy();
  }));
});
