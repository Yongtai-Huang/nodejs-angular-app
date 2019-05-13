import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  profile: Profile;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe( (data: {profile: Profile}) => {
      this.profile = data.profile;
    });
  }

}
