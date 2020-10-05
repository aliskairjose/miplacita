import { Order } from 'src/app/shared/classes/order';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from 'src/app/shared/classes/store';
import {
  OrderDetailsComponent
} from 'src/app/shared/custom-components/order-details/order-details.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { environment } from 'src/environments/environment';

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../../shared/services/shop.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-daily-sales-report',
  templateUrl: './daily-sales-report.component.html',
  styleUrls: [ './daily-sales-report.component.scss' ]
} )
export class DailySalesReportComponent implements OnInit {
  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;

  fields = [ 'Número de orden', 'Monto', 'Cliente', 'Estado', '' ];
  orders: Order[] = [];
  paginate: Paginate;
  orderStatus = environment.orderStatus;
  role: string;
  status = '';
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private shopService: ShopService,
    private orderService: OrderService,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnInit(): void {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( store ) {
        this.store = { ...store };
        this.init();
      }
    } );
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

  private init(): void {

    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.role = this.auth.getUserRol();

    if ( this.role === 'admin' ) { this.fields.splice( 1, 0, 'Tienda' ); }

    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }
  }

  private loadData( page = 1 ): void {

    const params = `store=${this.store._id}&from=${this.fechaIni}&to=${this.fechaFin}`;
    console.log( params );

    this.orderService.orderList( page, params ).subscribe( result => {
      console.log(result);
      
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }


  setPage( page: number ) {
    this.loadData( page );
  }

}
