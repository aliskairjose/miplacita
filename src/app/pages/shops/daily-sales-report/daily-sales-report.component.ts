import { Order } from 'src/app/shared/classes/order';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from 'src/app/shared/classes/store';
import { AuthService } from 'src/app/shared/services/auth.service';

import { environment } from 'src/environments/environment';

import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../../shared/services/shop.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { OrderDetailsComponent } from '../../../shared/components/order-details/order-details.component';
import { ReportsService } from '../../../shared/services/reports.service';
import { Filter } from '../../../shared/classes/filter';


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
  fieldsAdmin = [ 'Tienda', 'Producto', 'Monto', 'Cantidades vendidas' ];
  orders: Order[] = [];
  products = [];
  stores: Store[] = [];
  paginate: Paginate;
  orderStatus = environment.orderStatus;
  role: string;
  status = '';
  modelFrom: NgbDateStruct;
  showalert: boolean;
  filters: Filter = {};

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
    private ngbCalendar: NgbCalendar,
    private shopService: ShopService,
    private parseDate: CustomDateParserFormatterService,
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

    if ( this.role === 'merchant' ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
      this.init();
    }

  }

  filtrar( filters: Filter ): void {
    this.filters = filters;
    this.loadData();
  }

  private init(): void {
    this.modelFrom = this.ngbCalendar.getToday();
    this.filters.fechaIni = this.parseDate.format( this.modelFrom );
    this.filters.storeId = '';
    this.role = this.auth.getUserRol();

    if ( this.role === 'admin' ) {
      this.loadStores();
      this.fields.splice( 1, 0, 'Tienda' );
    }

    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }
  }

  private loadData(): void {
    let params = '';
    if ( this.role === 'merchant' ) {
      params = `store=${this.store._id}&from=${this.filters.fechaIni}&to=${this.filters.fechaIni}&report=true`;
      this.dailySales( params );
    } else {
      if ( this.type === 'daily-sales' ) {
        // Ventas diarias por productos
        params = `from=${this.filters.fechaIni}&to=${this.filters.fechaIni}&store=${this.filters.storeId}`;
      } else if ( this.type === 'daily-sales-mp' ) {
        // Ventas diarias por productos MP
        params = `from=${this.filters.fechaIni}&to=${this.filters.fechaIni}`;
      }
      this.dailySalesProducts( params );
    }
  }

  private dailySales( params: string ): void {
    this.reports.dailySales( params ).subscribe( result => {
      this.orders = [ ...result ];
      this.showalert = result.length;
    } );
  }

  private dailySalesProducts( params ): void {
    this.reports.dailySalesProducts( params ).subscribe( response => {
      this.products = response.result;
      this.showalert = response.result.length;
    } );
  }

  private loadStores( page = 1 ): void {
    // Reportes no llevan paginacion
    let params = '';

    params = `report=false`;

    this.reports.membershipActiveShop( page, params ).subscribe( result => {
      this.stores = result.docs;
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
