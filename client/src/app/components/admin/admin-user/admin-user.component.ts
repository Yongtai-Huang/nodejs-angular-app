import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { Errors } from '../../../models/errors.model';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  pageTitle = 'User List';
  avatar_url = environment.avatar_url;
  currentUser: User;
  users: User[];
  isSubmittingToggleAdmin = false;
  errors: Errors = new Errors();

  constructor(
    private title: Title,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);

    this.userService.currentUser.subscribe( (userData: User) => {
      this.currentUser = userData;
    });

    this.userService.getUsers().subscribe( data => {
      this.users = data;
    });
  }

  toggleAdmin(ind: number) {
    if (!this.currentUser.superAdmin) {
      return;
    }

    this.isSubmittingToggleAdmin = true;
    this.errors = {errors: {}};

    if (this.users[ind].admin) {
      this.userService.removeAdmin(this.users[ind].username)
      .subscribe( data => {
        this.users[ind] = data;
        this.isSubmittingToggleAdmin = false;
      }, (err) => {
        this.errors = err.errors;
        this.isSubmittingToggleAdmin = false;
      });

    } else {
      this.userService.addAdmin(this.users[ind].username)
      .subscribe( data => {
        this.users[ind] = data;
        this.isSubmittingToggleAdmin = false;
      }, (err) => {
        this.errors = err.errors;
        this.isSubmittingToggleAdmin = false;
      });
    }
  }

}
