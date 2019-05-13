import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { PhotoTagsService } from '../../../services/photo-tags.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit, OnDestroy {
  pageTitle = 'Photo list';
  limit = 6;
  photoListConfig: PhotoListConfig = {
    type: 'all',
    filters: {}
  };
  photoTags: Array<string> = [];
  photoTagsLoaded = false;
  selectedTag: string;
  flag: string;
  currentUserSubscription: Subscription;
  currentUser: User;

  constructor(
    private title: Title,
    private router: Router,
    private photoTagsService: PhotoTagsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUserSubscription = this.userService.currentUser
    .subscribe( (userData: User) => {
      this.currentUser = userData;
      this.setPhotoListTo('all');
    });

    this.photoTagsService.getAll()
    .subscribe(tags => {
      this.photoTags = tags;
      this.photoTagsLoaded = true;
    });

    this.title.setTitle(this.pageTitle);

  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  // type: 'all' or 'feed' ??
  // filters: limit and offset ??
  // Filters are not set in photo-list component
  setPhotoListTo(type: string, filters: Object = {}) {
    if (type === 'all') {
      this.flag = 'all';
    }

    if (type === 'feed') {
      this.flag = 'feed';
    }

    // If feed is requested but user is not authenticated, redirect to login
    if (type === 'feed' && !this.currentUser.username) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Otherwise, set the list object
    this.photoListConfig = {type: type, filters: filters};

    this.selectedTag = '';
    if (filters['tag']) {
      this.selectedTag = filters['tag'];
      this.flag = '';
    }

    if (filters['upvoted']) {
      this.flag = 'upvoted';
    }

    if (filters['downvoted']) {
      this.flag = 'downvoted';
    }
  }

}
