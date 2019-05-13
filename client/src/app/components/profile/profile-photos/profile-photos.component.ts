import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-photos',
  templateUrl: './profile-photos.component.html',
  styleUrls: ['./profile-photos.component.css']
})
export class ProfilePhotosComponent implements OnInit {
  profile: Profile;
	photosConfig: PhotoListConfig = {
		type: 'all',
		filters: {}
	};

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe( (data: {profile: Profile}) => {
      this.profile = data.profile;
      this.photosConfig = {
        type: 'all',
        filters: {}
      };
      this.photosConfig.filters.createdBy = this.profile.username;
    });
  }

}
