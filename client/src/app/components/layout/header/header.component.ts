import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  avatar_url = environment.avatar_url;
  currentUser: User;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe( (userData) => {
      this.currentUser = userData;
    });
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

}
