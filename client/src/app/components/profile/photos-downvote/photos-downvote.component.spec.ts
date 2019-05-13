import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosDownvoteComponent } from './photos-downvote.component';

describe('PhotosDownvoteComponent', () => {
  let component: PhotosDownvoteComponent;
  let fixture: ComponentFixture<PhotosDownvoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosDownvoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosDownvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
