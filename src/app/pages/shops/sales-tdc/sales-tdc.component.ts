import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
import { Store } from '../../../shared/classes/store';
import { Filter } from '../../../shared/classes/filter';
import { FiltersComponent } from '../../../shared/components/filters/filters.component';

@Component( {
  selector: 'app-sales-tdc',
  templateUrl: './sales-tdc.component.html',
  styleUrls: [ './sales-tdc.component.scss' ]
} )
export class SalesTdcComponent implements OnInit, AfterViewInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;
  @ViewChild( 'filter' ) filterComponent: FiltersComponent;

  fields = [ 'Cliente', 'Tienda', 'Fecha', 'Monto', 'Status' ];
  data = [];
  role: string;
  paginate: Paginate;
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  stores: Store[] = [];
  filters: Filter = {};

  constructor(
    private auth: AuthService,
    private ngbCalendar: NgbCalendar,
    private reports: ReportsService,
    private parseDate: CustomDateParserFormatterService

  ) { }

  ngAfterViewInit(): void {
    this.filterComponent.setElement( this.table );
  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filters.fechaIni = this.filters.fechaFin = this.parseDate.format( this.modelFrom );
    this.filters.storeId = '';
    this.role = this.auth.getUserRol();
    this.loadStores();
    this.loadData();
  }

  filtrar( filter: Filter ): void {
    this.filters = filter;

    this.loadData();
  }

  loadData() {
    const params = `from=${this.filters.fechaIni}&to=${this.filters.fechaFin}&store=${this.filters.storeId}`;

    this.reports.tdcSales( params ).subscribe( ( result ) => {
      this.data = [ ...result ];
    } );
  }

  private loadStores(): void {

    this.reports.membershipActiveShop( 1, `report=false` ).subscribe( result => {
      this.stores = result.docs;
    } );
  }
}
