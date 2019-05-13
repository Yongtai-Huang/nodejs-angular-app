import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { Errors } from '../../../models/errors.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  pageTitle = 'Edit Profile';
  avatar_url = environment.avatar_url;
  user: User = {} as User;
  profileEditForm: FormGroup;
  errors: Errors = new Errors();
  isSubmitting = false;
  username: string;
  bio: string;
  email: string;
  password: string;
  formData: FormData = new FormData();
  removeAvatar = false;
  fileList: FileList;
  wrongFileType = false;
  sizeLimit = 1;  // MB
  fileTooLarge = false;

  constructor(
    private title: Title,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Create form group using the form builder
    this.profileEditForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      firstname: '',
      lastname: '',
      bio: '',
      email: '',
      password: '',
      uploadFile: ''
    });
  }

  ngOnInit() {
    // Make a copy of the current user's object to place in editable form fields
    Object.assign(this.user, this.userService.getCurrentUser());
    // Fill the form
    this.profileEditForm.patchValue(this.user);

    this.title.setTitle(this.pageTitle);
  }

  onRemoveAvatar() {
    this.removeAvatar = !this.removeAvatar;

    if (this.formData === null) {
      const formData: FormData = new FormData();
      formData.append('removeAvatar', this.removeAvatar.toString());
      this.formData = formData;
    } else {
      this.formData.append('removeAvatar', this.removeAvatar.toString());
    }
  }

  // Get image file
  fileChange(event: any) {
    this.fileTooLarge = false;
    this.wrongFileType = false;
    const file: File = this.fileList[0];

    if (file.size / Math.pow(1024, 2) > this.sizeLimit) {
      this.fileTooLarge = true;
      return;
    }

    const ind = ['jpg', 'jpeg', 'png', 'gif'].indexOf(file.type.split('/')[1]);
    if (file.type.split('/')[0] !== 'image' || ind < 0) {
      this.wrongFileType = true;
      return;
    }
    this.fileList = event.target.files;
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  submitForm(value: any) {
    this.isSubmitting = true;
    this.errors = {errors: {}};

    if (this.fileList && this.fileList.length > 0) {
      const file: File = this.fileList[0];

      if (this.formData === null) {
        const formData: FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        this.formData = formData;
      } else {
        this.formData.append('uploadFile', file, file.name);
      }
    }

    if (this.formData === null) {
      const formData: FormData = new FormData();
      formData.append('username', value.username);
      this.formData = formData;
    } else {
      this.formData.append('username', value.username);
    }

    if (value.firstname) {
      this.formData.append('firstname', value.firstname);
    }

    if (value.lastname) {
      this.formData.append('lastname', value.lastname);
    }

    if (value.bio) {
      this.formData.append('bio', value.bio);
    }

    if (value.email) {
      this.formData.append('email', value.email);
    }

    if (value.password) {
      this.formData.append('password', value.password);
    }

    this.userService
    .update(this.formData)
    .subscribe( (updatedUser) => {
      this.isSubmitting = false;
      this.formData = null;
      this.fileList = null;
      this.removeAvatar = false;
      this.router.navigateByUrl('/profile/' + updatedUser.username + '/profile-info');
    }, err => {
        this.errors = err.error;
        this.isSubmitting = false;
        this.formData = null;
        this.fileList = null;
        this.removeAvatar = false;
    });
  }

  cancel() {
    this.formData = null;
    this.fileList = null;
    this.isSubmitting = false;
    this.removeAvatar = false;
    this.router.navigateByUrl('/profile/' + this.user.username + '/profile-info');
  }

}
