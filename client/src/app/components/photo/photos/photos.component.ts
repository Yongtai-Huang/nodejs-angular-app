import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { PhotoTagsService } from '../../../services/photo-tags.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  isAuthenticated: boolean;
  limit: number = 6;
  photoListConfig: PhotoListConfig = {
    type: 'all',
    filters: {}
  };
  photoTags: Array<string> = [];
  photoTagsLoaded = false;

  constructor(
    private router: Router,
    private photoTagsService: PhotoTagsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.isAuthenticated
    .subscribe( (authenticated) => {
      this.isAuthenticated = authenticated;

      // Set the photo list to fetch all photos
      this.setPhotoListTo('all');

      // The following setting will fetch the photos of your following
      // if (authenticated) {
      //   this.setPhotoListTo('feed');
      // } else {
      //   this.setPhotoListTo('all');
      // }

    });

    this.photoTagsService.getAll()
    .subscribe(tags => {
      this.photoTags = tags;
      this.photoTagsLoaded = true;
    });

  }

  // type: 'all' or 'feed' ??
  // filters: limit and offset ??
  // Filters are not set in photo-list component
  setPhotoListTo(type: string = '', filters: Object = {}) {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === 'feed' && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Otherwise, set the list object
    this.photoListConfig = {type: type, filters: filters};
  }

}
