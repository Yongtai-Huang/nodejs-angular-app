import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PhotoComment } from '../../../models/photo-comment.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-photo-comment',
  templateUrl: './photo-comment.component.html',
  styleUrls: ['./photo-comment.component.css']
})
export class PhotoCommentComponent implements OnInit, OnDestroy {
  avatar_url = environment.avatar_url;
  @Input() photoComment: PhotoComment;
  @Output() deletePhotoComment = new EventEmitter<boolean>();
  canModify: boolean;
  private subscription: Subscription;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // Load the current user's data
    this.subscription = this.userService.currentUser
    .subscribe( (userData: User) => {
      this.canModify = (userData.username === this.photoComment.author.username);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteClicked() {
    this.deletePhotoComment.emit(true);
  }

}
