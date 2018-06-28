import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors } from '../../../models/errors.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: string = '';
  pageTitle: string = '';
  errors: Errors = new Errors();
  isSubmitting = false;
  authForm: FormGroup;

  uploadFile: File;
  formData: FormData = new FormData();

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Use FormBuilder to create a form group
      this.authForm = this.fb.group({
        'email': ['', Validators.required],
        'password': ['', Validators.required]
      });
    }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a page title for the page accordingly
      this.pageTitle = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      // Add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
        this.authForm.addControl('firstname', new FormControl());
        this.authForm.addControl('lastname', new FormControl());
        this.authForm.addControl('uploadFile', new FormControl());
      }
    });

    this.title.setTitle(this.pageTitle);
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.formData = formData;
    }
  }

  submitForm(value) {
    this.isSubmitting = true;
    this.errors = {errors: {}};

     // No uploadfile
    if (this.formData === null) {
      let formData: FormData = new FormData();
      formData.append('email', value.email.trim());
      formData.append('password', value.password.trim());
      this.formData = formData;
    } else {
      this.formData.append('email', value.email.trim());
      this.formData.append('password', value.password.trim());
    }

    if (value.username) {
      this.formData.append('username', value.username.trim());
    }

    if (value.firstname) {
      this.formData.append('firstname', value.firstname.trim());
    }

    if (value.lastname) {
      this.formData.append('lastname', value.lastname.trim());
    }

    this.userService.attemptAuth(this.authType, this.formData)
    .subscribe(  (data) => {
      this.formData = null;
      this.isSubmitting = false;
      this.router.navigateByUrl('/');
    }, err => {
      this.errors = err.error;
      this.isSubmitting = false;
      this.formData = null;
    });
  }

}
