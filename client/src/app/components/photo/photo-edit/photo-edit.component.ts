import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Errors } from '../../../models/errors.model';
import { Photo } from '../../../models/photo.model';
import { PhotosService } from '../../../services/photos.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {
  pageTitle = 'Upload New Photo';
  photo_url = environment.photo_url;
  photo: Photo = new Photo();
  photoForm: FormGroup;
  tagField = new FormControl();
  errors: Errors = new Errors();
  isSubmitting = false;
  isFileSelected = false; // Requied to select a photo, for validation

  uploadFile: File;
  formData: FormData = new FormData();

  constructor(
    private title: Title,
    private photosService: PhotosService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  // Use the FormBuilder to create a form group
    this.photoForm = this.fb.group({
      uploadFile: '',
      title: '',
      description: '',
      takenAt: ''
    });
  }

  ngOnInit() {
    // If there's an photo prefetched, load it
    this.route.data.subscribe( (data: {photo: Photo}) => {
      if (data.photo) {
        this.photo = data.photo;
        this.pageTitle = "Update Photo";
        this.photoForm.patchValue(data.photo);
      }
    });

    this.title.setTitle(this.pageTitle);
  }

  addTag() {
    // Retrieve tag control
    const tag = this.tagField.value;
    // Only add tag if it does not exist yet
    if (tag && this.photo.tagList.indexOf(tag) < 0) {
      this.photo.tagList.push(tag);
    }
    // Clear the input
    this.tagField.reset('');
  }

  removeTag(tagName: string) {
    this.photo.tagList = this.photo.tagList.filter((tag) => tag !== tagName);
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.isFileSelected = true;
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.formData = formData;
    }
  }

  // Submit form
  submitForm(value) {
    this.errors = {errors: {}};

    if (!this.isFileSelected && !this.photo.image) {
      this.errors = {errors: {'Error: ': 'You must select a image file.'}}; //??
      return; //??
    }

    this.isSubmitting = true;
    this.addTag();   //In case not press Enter

    if (this.formData === null) {
      if (value.title) {
        let formData: FormData = new FormData();
        formData.append('title', value.title);
        this.formData = formData;
      }
    } else {
      if (value.title) {
        this.formData.append('title', value.title);
      }
    }

    if (this.formData === null) {
      if (value.description) {
        let formData: FormData = new FormData();
        formData.append('description', value.description);
        this.formData = formData;
      }
    } else {
      if (value.description) {
        this.formData.append('description', value.description);
      }
    }

    if (this.formData === null) {
      if (value.takenAt) {
        let formData: FormData = new FormData();
        formData.append('takenAt', value.takenAt);
        this.formData = formData;
      }
    } else {
      if (value.takenAt) {
        this.formData.append('takenAt', value.takenAt);
      }
    }

    if (this.formData === null) {
      if (value.takenBy) {
        let formData: FormData = new FormData();
        formData.append('takenBy', value.takenBy);
        this.formData = formData;
      }
    } else {
      if (value.takenBy) {
        this.formData.append('takenBy', value.takenBy);
      }
    }

    if (this.formData === null) {
      if (this.photo.tagList.length > 0) {
        let formData: FormData = new FormData();
        formData.append('tagList', JSON.stringify(this.photo.tagList));
        this.formData = formData;
      }
    } else {
      if (this.photo.tagList.length > 0) {
        this.formData.append('tagList', JSON.stringify(this.photo.tagList));
      }
    }

    // Update photo
    if (this.formData === null) {
      if (this.photo.slug) {
        let formData: FormData = new FormData();
        formData.append('slug', this.photo.slug);
        this.formData = formData;
      }
    } else {
      if (this.photo.slug) {
        this.formData.append('slug', this.photo.slug);
      }
    }

    // Post the changes
    this.photosService
    .save(this.formData)
    .subscribe( (photo) => {
      this.router.navigateByUrl('/photo/' + photo.slug);
      this.isSubmitting = false;
      this.isFileSelected = false;
      this.formData = null;
    }, (err) => {
      this.errors = err.error;
      this.isSubmitting = false;
      this.isFileSelected = false;
      this.formData = null;
    });
  }

  cancel() {
    this.formData = null;
    if (this.photo.slug) {
      this.router.navigateByUrl('/photo/'+ this.photo.slug);
    } else {
      this.router.navigateByUrl('/photos');
    }
  }

}
