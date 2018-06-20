import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCommentComponent } from './photo-comment.component';

describe('PhotoCommentComponent', () => {
  let component: PhotoCommentComponent;
  let fixture: ComponentFixture<PhotoCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
