import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from 'src/app/shared/classes/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ExportService } from 'src/app/shared/services/export.service';

import {
  Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { OrderDetailsComponent } from '../../../shared/components/order-details/order-details.component';
import { ReportsService } from '../../../shared/services/reports.service';
import { Order } from 'src/app/shared/classes/order';
import { Filter } from '../../../shared/classes/filter';
@Component( {
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: [ './total-sales.component.scss' ]
} )
export class TotalSalesComponent implements OnInit, OnChanges {
  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Fecha', 'Cantidades ordenadas', 'Total de ventas' ];
  fieldsAdmin = [ 'Tienda', 'Monto', 'Fecha', 'Estado', 'Acción' ];
  sales: any = [];
  orders: Order[] = [];
  paginate: Paginate;
  role: string;
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  filter: Filter = {};

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
    private ngbCalendar: NgbCalendar,
    private parseDate: CustomDateParserFormatterService
  ) {
  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.role = this.auth.getUserRol();

    if ( this.role === 'merchant' ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );

    }
    this.init();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filter.fechaIni = this.filter.fechaFin = this.parseDate.format( this.modelFrom );
    this.loadData();
  }

  private loadData( page = 1 ): void {
    if ( this.role === 'merchant' ) {
      const params = `store=${this.store._id}&from=${this.filter.fechaIni}&to=${this.filter.fechaFin}`;
      this.reports.totalSales( params ).subscribe( ( result ) => {
        this.sales = result;
      } );
    }

    if ( this.role === 'admin' ) {
      const params = `order?report=true&from=${this.filter.fechaIni}&to=${this.filter.fechaFin}`;
      this.reports.ordersMP( params ).subscribe( response => {
        this.orders = [ ...response.result ];
      } );
    }

  }

  filtrar( filter: Filter ): void {
    this.filter = filter;
    this.loadData();
  }


  setPage( page: number ) {
    this.loadData( page );
  }


}
