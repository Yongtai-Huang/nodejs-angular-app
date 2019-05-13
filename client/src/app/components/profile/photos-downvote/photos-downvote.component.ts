import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-photos-downvote',
  templateUrl: './photos-downvote.component.html',
  styleUrls: ['./photos-downvote.component.css']
})
export class PhotosDownvoteComponent implements OnInit {
  profile: Profile;
  photoDownvotesConfig: PhotoListConfig = {
    type: 'all',
    filters: {}
  };
  limit = 10;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe( (data: {profile: Profile}) => {
      this.profile = data.profile;
      this.photoDownvotesConfig.filters.downvoted = this.profile.username;
    });
  }

}
