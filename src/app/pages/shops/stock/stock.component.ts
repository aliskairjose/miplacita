import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Paginate } from 'src/app/shared/classes/paginate';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../../../shared/classes/filter';
import { FiltersComponent } from '../../../shared/components/filters/filters.component';

@Component( {
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: [ './stock.component.scss' ]
} )
export class StockComponent implements OnInit, AfterViewInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;
  @ViewChild( 'filter' ) filterComponent: FiltersComponent;

  fields = [ 'Tienda', 'Dueño', 'Nombre del producto', 'Cantidad en existencia' ];
  products = [];
  role: string;
  paginate: Paginate;
  modelFrom: NgbDateStruct;
  filter: Filter = {};

  constructor(
    private auth: AuthService,
    private reportService: ReportsService,
  ) { }

  ngAfterViewInit(): void {
    this.filterComponent.setElement( this.table );
  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.loadData();
  }

  loadData() {
    // tslint:disable-next-line: deprecation
    this.reportService.stockMP( this.filter.storeId ).subscribe( ( products ) => {
      this.products = [ ...products ];
    } );
  }

  filtrar( filter: Filter ) {
    this.filter = filter;
    this.loadData();
  }

}
