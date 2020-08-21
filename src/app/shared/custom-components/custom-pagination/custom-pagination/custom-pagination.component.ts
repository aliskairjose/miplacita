import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component( {
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: [ './custom-pagination.component.scss' ]
} )
export class CustomPaginationComponent implements OnInit {

  @Input() items = [];
  @Input() paginate: any = {};

  @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  pageSet( page: number ) {
    this.setPage.emit( page );  // Set Page Number
  }

}
