import { Component, OnInit, Output, Input, EventEmitter, DoCheck, OnChanges } from '@angular/core';
import { Paginate } from '../../../classes/paginate';

@Component( {
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: [ './custom-pagination.component.scss' ]
} )
export class CustomPaginationComponent implements OnInit, OnChanges {

  pages = [];
  @Input() items = [];
  @Input() paginate: Paginate;
  @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.paginate.page % 5 === 0){
      this.pages = this.paginate.pages.slice(this.paginate.page - 5 , this.paginate.page);
    } else {
      const init = Math.trunc(this.paginate.page / 5) * 5;
      this.pages = this.paginate.pages.slice(init , init + 5);
    }
  }

  pageSet( page: number ) {
    this.setPage.emit( page );  // Set Page Number
  }

  navigateIndex(page: number){
    if (page > this.paginate.page){
      if ( !(this.paginate.totalPages - 5 < page && page < this.paginate.totalPages) ){
        const init = this.pages[this.pages.length - 1];
        this.pages = this.paginate.pages.slice(init, init + 5);
      }
    } else {
      if ( this.pages[0] !== 1 ){
        const end = this.pages[0];
        this.pages = this.paginate.pages.slice(end - 6, end - 1);
      }
    }
  }

}
