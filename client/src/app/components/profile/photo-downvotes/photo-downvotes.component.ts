import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-photo-downvotes',
  templateUrl: './photo-downvotes.component.html',
  styleUrls: ['./photo-downvotes.component.css']
})
export class PhotoDownvotesComponent implements OnInit {
  profile: Profile;
  photoDownvotesConfig: PhotoListConfig = {
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
      this.photoDownvotesConfig.filters.downvoted = this.profile.username;
    });
  }

}
