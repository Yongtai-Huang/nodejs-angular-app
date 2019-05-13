import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosFollowingComponent } from './photos-following.component';

describe('PhotosFollowingComponent', () => {
  let component: PhotosFollowingComponent;
  let fixture: ComponentFixture<PhotosFollowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosFollowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
