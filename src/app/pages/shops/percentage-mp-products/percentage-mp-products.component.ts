import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { Store } from '../../../shared/classes/store';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-percentage-mp-products',
  templateUrl: './percentage-mp-products.component.html',
  styleUrls: [ './percentage-mp-products.component.scss' ]
} )
export class PercentageMpProductsComponent implements OnInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Fecha', 'Tipo', 'Tienda', 'Ganancia Total' ];
  fieldsHeader = [ '20% MP', '% Tienda' ];
  data: any = {};
  role: string;
  stores: Store[] = [];
  storeSelected: Store = {};
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  fechaIni = '';
  fechaFin = '';
  noData: boolean;

  private _storeID = '';

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private exportDoc: ExportService,
    private reportService: ReportsService,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );
    this.loadData();
    this.loadStores();
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

  selectStore( store: Store ): void {
    this.storeSelected = store;
    this._storeID = store._id;
  }

  private loadData() {
    const params = `from=${this.fechaIni}&to=${this.fechaFin}&store=${this._storeID}`;
    this.reportService.percentageMpSales( params ).subscribe( response => {
      this.data = { ...response };
      this.noData = response.result.length;
    } );
  }

  private loadStores(): void {
    let params = '';
    params = `report=false`;
    this.reportService.membershipActiveShop( 1, params ).subscribe( result => {
      this.stores = result.docs;
    } );
  }


  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'stock-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Inventario', 'stock-report' );
  }

}
