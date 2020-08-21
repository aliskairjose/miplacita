import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Paginate } from '../../../classes/paginate';

@Component( {
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: [ './custom-pagination.component.scss' ]
} )
export class CustomPaginationComponent implements OnInit {

  @Input() items = [];
  @Input() paginate: Paginate;

  @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  pageSet( page: number ) {
    this.setPage.emit( page );  // Set Page Number
  }

}
