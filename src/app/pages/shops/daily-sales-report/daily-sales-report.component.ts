import { Order } from 'src/app/shared/classes/order';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from 'src/app/shared/classes/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ExportService } from 'src/app/shared/services/export.service';

import { environment } from 'src/environments/environment';

import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../../shared/services/shop.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailsComponent } from '../../../shared/components/order-details/order-details.component';
import { ReportsService } from '../../../shared/services/reports.service';
import { ActivatedRoute } from '@angular/router';


@Component( {
  selector: 'app-daily-sales-report',
  templateUrl: './daily-sales-report.component.html',
  styleUrls: [ './daily-sales-report.component.scss' ]
} )
export class DailySalesReportComponent implements OnInit, OnChanges {
  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;
  @Input() store: Store;
  @Input() type: string;

  fields = [ 'Número de orden', 'Monto', 'Cliente', 'Fecha', 'Estado', '' ];
  fieldsAdmin = [ 'Tienda', 'Producto', 'Monto', 'Cantidades vendidas', 'Estado' ];
  orders: Order[] = [];
  products = [];
  paginate: Paginate;
  orderStatus = environment.orderStatus;
  role: string;
  status = '';
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private reports: ReportsService,
    private exportDoc: ExportService,
    private ngbCalendar: NgbCalendar,
    private shopService: ShopService,
    private parseDate: CustomDateParserFormatterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    if ( this.store ) {
      this.shopService.storeObserver().subscribe( ( store: Store ) => {
        if ( store ) {
          this.store = { ...store };
          this.init();
        }
      } );
    } else {
      this.init();
    }
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.role = this.auth.getUserRol();

    if ( this.role == 'merchant' ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
      this.init();
    }

  }

  filtrar(): void {
    this.fechaIni = this.fechaFin = this.parseDate.format( this.modelFrom );
    // this.fechaIni = this.parseDate.format( this.modelFrom );
    // this.fechaFin = this.parseDate.format( this.modelTo );
    const from = new Date( this.fechaIni );
    const to = new Date( this.fechaFin );

    if ( from > to ) {
      this.toastr.warning( 'La fecha inicial no debe ser menor a la final' );
      return;
    }
    this.loadData();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.fechaFin = this.parseDate.format( this.modelFrom );
    this.role = this.auth.getUserRol();

    if ( this.role === 'admin' ) { this.fields.splice( 1, 0, 'Tienda' ); }

    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }
  }

  private loadData( page = 1 ): void {
    let params = '';
    if ( this.role === 'merchant' ) {
      params = `store=${this.store._id}&from=${this.fechaIni}&to=${this.fechaFin}&report=true`;
      this.dailySales( params );
    } else {
      if ( this.type === 'daily-sales' ) {
        // Ventas diarias por productos
        params = `from=${this.fechaIni}&to=${this.fechaFin}&store${this.store._id}`;
      } else if ( this.type === 'daily-sales-mp' ) {
        // Ventas diarias por productos MP
        params = `from=${this.fechaIni}&to=${this.fechaFin}`;
      }
      this.dailySalesProducts( params );
    }
  }

  private dailySales( params: string ): void {
    this.reports.dailySales( 1, params ).subscribe( result => {
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

  private dailySalesProducts( params ): void {
    this.reports.dailySalesProducts( params ).subscribe( response => {
      this.orders = response.result;
    } );
  }


  setPage( page: number ) {
    this.loadData( page );
  }

  /************************************** */
  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'daily-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Ventas diarias', 'daily-report' );
  }
}
