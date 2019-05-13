import { Component, OnInit } from '@angular/core';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-photos-following',
  templateUrl: './photos-following.component.html',
  styleUrls: ['./photos-following.component.css']
})
export class PhotosFollowingComponent implements OnInit {
  profile: Profile;
  limit = 10;
  photosUpvoteConfig: PhotoListConfig = {
    type: 'feed',
    filters: {}
  };

  constructor() { }

  ngOnInit() {
  }

}
