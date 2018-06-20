import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePhotosComponent } from './profile-photos.component';

describe('ProfilePhotosComponent', () => {
  let component: ProfilePhotosComponent;
  let fixture: ComponentFixture<ProfilePhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
