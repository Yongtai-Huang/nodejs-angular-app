import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { User } from '../../../models/user.model';
import { Profile } from '../../../models/profile.model';
import { UserService } from '../../../services/user.service';
import { ProfileService } from '../../../services/profile.service';
import { environment } from '../../../../environments/environment';
import { Errors } from '../../../models/errors.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  pageTitle = 'Profile';
  avatar_url = environment.avatar_url;
  profile: Profile;
  currentUser: User;
  isSubmittingFollow =false;
  errors: Errors = new Errors();
  isAuthenticated: boolean;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: {profile: Profile}) => {
      this.profile = data.profile;
      this.pageTitle = 'Profile of ' + data.profile.username;

      // Load the current user's data.
      this.userService.currentUser.subscribe( (userData: User) => {
        this.currentUser = userData;
      });
    });

    this.userService.isAuthenticated.subscribe( (authenticated) => {
      this.isAuthenticated = authenticated;
    });

    this.title.setTitle(this.pageTitle);
  }

  toggleFollowing() {
    this.isSubmittingFollow = true;
    this.errors = {errors: {}};

    // Follow this profile if we aren't already
    if (!this.profile.following) {

      this.profileService.follow(this.profile.username)
      .subscribe( (data) => {
        this.isSubmittingFollow = false;
        this.profile = data['profile'];
      }, (err) => {
        this.isSubmittingFollow = false;
        this.errors = err.error;
      });

    // Otherwise, unfollow this profile
    } else {
      this.profileService.unfollow(this.profile.username)
      .subscribe( (data) => {
        this.isSubmittingFollow = false;
        this.profile = data['profile'];
      }, (err) => {
        this.isSubmittingFollow = false;
        this.errors = err.error;
      });
    }

  }

}
