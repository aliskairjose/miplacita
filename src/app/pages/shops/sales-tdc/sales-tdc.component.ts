import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '../../../shared/classes/store';

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
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  stores: Store[] = [];
  storeSelected: Store = {};
  private _storeId = '';

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private exportDoc: ExportService,
    private reports: ReportsService,
    private parseDate: CustomDateParserFormatterService

  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.fechaFin = this.parseDate.format( this.modelFrom );
    this.role = this.auth.getUserRol();
    this.loadStores();
    this.loadData();
  }

  filtrar(): void {
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );
    const from = new Date( this.fechaIni );
    const to = new Date( this.fechaFin );

    if ( from > to ) {
      this.toastr.warning( 'La fecha inicial no debe ser menor a la final' );
      return;
    }

    this.loadData();
  }

  loadData() {
    const params = `from=${this.fechaIni}&to=${this.fechaFin}&store=${this._storeId}`;
    this.reports.tdcSales( params ).subscribe( ( result ) => {
      console.log( result, 'ventas con tdc' );
      this.data = [ ...result ];
    } );
  }

  selectStore( store: Store ): void {
    if ( store ) {
      this.storeSelected = store;
      this._storeId = store._id;
    } else {
      this.storeSelected.name = null;
      this._storeId = '';
    }

  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'tdc-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Ventas con TDC', 'tdc-report' );
  }

  private loadStores(): void {
    this.reports.membershipActiveShop( 1, `report=false` ).subscribe( result => {
      this.stores = result.docs;
    } );
  }
}
