import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUpvotesComponent } from './photo-upvotes.component';

describe('PhotoUpvotesComponent', () => {
  let component: PhotoUpvotesComponent;
  let fixture: ComponentFixture<PhotoUpvotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoUpvotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoUpvotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
