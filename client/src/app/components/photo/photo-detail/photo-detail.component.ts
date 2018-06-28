import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Photo } from '../../../models/photo.model';
import { PhotoComment } from '../../../models/photo-comment.model';
import { User } from '../../../models/user.model';
import { PhotosService } from '../../../services/photos.service';
import { PhotoCommentsService } from '../../../services/photo-comments.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';

import { Profile } from '../../../models/profile.model';
import { ProfileService } from '../../../services/profile.service';
import { Errors } from '../../../models/errors.model';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  pageTitle = 'Photo Detail';
  photo_url = environment.photo_url;
  avatar_url = environment.avatar_url;
  photo: Photo;
  currentUser: User;
  profile: Profile;
  canModify: boolean;
  photoComments: PhotoComment[];
  photoCommentControl = new FormControl("", Validators.required);
  isSubmittingFollow =false;
  isSubmittingVote = false;
  isSubmittingComment = false;

  isDeleting = false;
  isCommenting = false;
  errors: Errors = new Errors();
  isAuthenticated: boolean;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private photoCommentsService: PhotoCommentsService,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    // Retreive the prefetched photo
    this.route.data
    .subscribe( (data: { photo: Photo }) => {
      this.photo = data.photo;
      this.profile = data.photo.takenBy;  //Added by hyt
      // Load the pphotoComments on this photo
      this.populatePhotoComments();
    });

    // Load the current user's data
    this.userService.currentUser
    .subscribe( (userData: User) => {
      this.currentUser = userData;

      this.canModify = (this.currentUser.username === this.photo.takenBy.username);
    });

    this.userService.isAuthenticated.subscribe( (authenticated) => {
      this.isAuthenticated = authenticated;
    });

    this.title.setTitle(this.pageTitle);
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
        this.errors = err.error;
        this.isSubmittingVote = false;
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

  toggleFollowing() {
    this.isSubmittingFollow = true;
    this.errors = {errors: {}};

    // Follow this profile if we aren't already
    if (!this.profile.following) {
      this.profileService.follow(this.profile.username)
      .subscribe( (data) => {
        this.isSubmittingFollow = false;
        this.profile = data['profile']; //??
      }, (err) => {
        this.errors = err.error;
        this.isSubmittingFollow = false;
      });

    // Otherwise, unfollow this profile
    } else {
      this.profileService.unfollow(this.profile.username)
      .subscribe( (data) => {
        this.isSubmittingFollow = false;
        this.profile = data['profile']; //??
      }, (err) => {
        this.errors = err.error;
        this.isSubmittingFollow = false
      });
    }

  }

  deletePhoto() {
    this.isDeleting = true;

    this.photosService.destroy(this.photo.slug).subscribe( success => {
      this.router.navigateByUrl('/');
    });
  }

  populatePhotoComments() {
    this.photoCommentsService.getAll(this.photo.slug)
    .subscribe(photoComments => this.photoComments = photoComments);
  }

  addPhotoComment() {
    this.isSubmittingComment = true;
    this.errors = {errors: {}};

    const photoCommentBody = this.photoCommentControl.value;
    this.photoCommentsService
    .add(this.photo.slug, photoCommentBody)
    .subscribe( comment => {
      this.photoComments.unshift(comment);
      this.photoCommentControl.reset('');
      this.isSubmittingComment = false;
      this.isCommenting = false;
    }, err => {
      this.isSubmittingComment = false;
      this.errors = err.error;
    });
  }

  onDeletePhotoComment(comment) {
    this.photoCommentsService.destroy(comment.id, this.photo.slug)
    .subscribe( success => {
      this.photoComments = this.photoComments.filter((item) => item !== comment);
    });
  }

  toComment() {
    this.isCommenting = true;
  }

}
