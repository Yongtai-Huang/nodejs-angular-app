import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosUpvoteComponent } from './photos-upvote.component';

describe('PhotosUpvoteComponent', () => {
  let component: PhotosUpvoteComponent;
  let fixture: ComponentFixture<PhotosUpvoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosUpvoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosUpvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
