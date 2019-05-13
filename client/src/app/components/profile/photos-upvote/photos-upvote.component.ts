import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-photos-upvote',
  templateUrl: './photos-upvote.component.html',
  styleUrls: ['./photos-upvote.component.css']
})
export class PhotosUpvoteComponent implements OnInit {
  profile: Profile;
  photoUpvotesConfig: PhotoListConfig = {
    type: 'all',
    filters: {}
  };

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe( (data: {profile: Profile}) => {
      this.profile = data.profile;
      this.photoUpvotesConfig.filters.upvoted = this.profile.username;
    });
  }

}
