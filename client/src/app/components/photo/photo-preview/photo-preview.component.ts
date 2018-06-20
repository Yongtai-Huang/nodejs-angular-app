import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user.model';
import { Photo } from '../../../models/photo.model';
import { PhotosService } from '../../../services/photos.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { Errors } from '../../../models/errors.model';


@Component({
  selector: 'app-photo-preview',
  templateUrl: './photo-preview.component.html',
  styleUrls: ['./photo-preview.component.css']
})
export class PhotoPreviewComponent implements OnInit {
  @Input() photo: Photo;
  photo_url = environment.photo_url;
  avatar_url = environment.avatar_url;
  isSubmittingVote = false;
  errors: Errors = new Errors();
  currentUser: User;
  canVote: boolean;
  isAuthenticated: boolean;

  constructor(
    private photosService: PhotosService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe( (userData: User) => {
      this.currentUser = userData;
      this.canVote = (this.currentUser.username !== this.photo.takenBy.username)
    });

    this.userService.isAuthenticated.subscribe( (authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }

  toggleUpvote() {
    this.isSubmittingVote = true;
    this.errors = {errors: {}};

    // Upvote the photo if it isn't upvoted yet
    if (!this.photo.upvoted) {
      this.photosService.upvote(this.photo.slug)
      .subscribe( (data) => {
        this.isSubmittingVote = false;
        this.photo = data['photo'];
      }, (err) => {
        this.isSubmittingVote = false;
        this.errors = err.error;
      });

    // Otherwise, unupvote the photo
    } else {
      this.photosService.unupvote(this.photo.slug)
      .subscribe(  (data) => {
        this.isSubmittingVote = false;
        this.photo = data['photo'];
      }, (err) => {
        this.errors = err.error;
        this.isSubmittingVote = false;
      });
    }

  }

  toggleDownvote() {
    this.isSubmittingVote = true;
    this.errors = {errors: {}};

    // Downvote the photo if it isn't downvoted yet
    if (!this.photo.downvoted) {
      this.photosService.downvote(this.photo.slug)
      .subscribe( (data) => {
        this.isSubmittingVote = false;
        this.photo = data['photo'];
      }, (err) => {
        this.errors = err.error;
        this.isSubmittingVote = false;
      });

    // Otherwise, undownvote the photo
    } else {
      this.photosService.undownvote(this.photo.slug)
      .subscribe(  (data) => {
        this.isSubmittingVote = false;
        this.photo = data['photo'];
      }, (err) => {
        this.errors = err.error;
        this.isSubmittingVote = false;
      });
    }

  }

}
