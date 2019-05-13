import { Component, OnInit, Input } from '@angular/core';
import { Errors } from '../../models/errors.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.css']
})
export class ListErrorsComponent implements OnInit {
  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: Errors) {
    this.formattedErrors = [];

    if (errorList.errors) {
      this.formattedErrors = Object.keys(errorList.errors || {})
      .map(key => `${key} ${errorList.errors[key]}`);
    }
  }

  constructor() { }

  ngOnInit() { }

  get errorList() { return this.formattedErrors; }

}
