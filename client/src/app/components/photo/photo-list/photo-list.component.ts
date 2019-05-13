import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '../../../models/photo.model';
import { PhotoListConfig } from '../../../models/photo-list-config.model';
import { PhotosService } from '../../../services/photos.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  query: PhotoListConfig;
  photos: Photo[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];

  @Input() limit: number;
  @Input()
  set config(config: PhotoListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  constructor(
    private photosService: PhotosService
  ) { }

  ngOnInit() {
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.photos = [];

    // Create limit and offset filter (if necessary)
    // limit: the maxium number of photos that are displayed on a page
    // offset:
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1))
    }

    this.photosService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      this.photos = data.photos;

      this.totalPages = [];
      for (let i = 0; i < Math.ceil(data.photosCount / this.limit); i++) {
        this.totalPages.push(i + 1);
      }
    });
  }

}
