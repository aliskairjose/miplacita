import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '../../../shared/classes/store';
import { Filter } from '../../../shared/classes/filter';

@Component( {
  selector: 'app-sales-tdc',
  templateUrl: './sales-tdc.component.html',
  styleUrls: [ './sales-tdc.component.scss' ]
} )
export class SalesTdcComponent implements OnInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

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
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private reports: ReportsService,
    private parseDate: CustomDateParserFormatterService

  ) { }

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
      console.log( result, 'ventas con tdc' );
      this.data = [ ...result ];
    } );
  }

  private loadStores(): void {
    this.reports.membershipActiveShop( 1, `report=false` ).subscribe( result => {
      this.stores = result.docs;
    } );
  }
}
