import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDownvotesComponent } from './photo-downvotes.component';

describe('PhotoDownvotesComponent', () => {
  let component: PhotoDownvotesComponent;
  let fixture: ComponentFixture<PhotoDownvotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoDownvotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDownvotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
