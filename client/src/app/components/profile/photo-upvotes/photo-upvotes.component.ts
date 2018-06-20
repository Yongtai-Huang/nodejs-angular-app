import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-photo-upvotes',
  templateUrl: './photo-upvotes.component.html',
  styleUrls: ['./photo-upvotes.component.css']
})
export class PhotoUpvotesComponent implements OnInit {
  profile: Profile;
  photoUpvotesConfig: PhotoListConfig = {
    type: 'all',
    filters: {}
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe( (data: {profile: Profile}) => {
      this.profile = data.profile;
      this.photoUpvotesConfig.filters.upvoted = this.profile.username;
    });
  }

}
