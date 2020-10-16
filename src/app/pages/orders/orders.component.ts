import { ToastrService } from 'ngx-toastr';

import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';
import {
  CustomDateParserFormatterService
} from '../../shared/adapter/custom-date-parser-formatter.service';
import { Order } from '../../shared/classes/order';
import { Paginate } from '../../shared/classes/paginate';
import { Store } from '../../shared/classes/store';
import {
  OrderDetailsComponent
} from '../../shared/custom-components/order-details/order-details.component';
import { AuthService } from '../../shared/services/auth.service';
import { OrderService } from '../../shared/services/order.service';
import { ShopService } from '../../shared/services/shop.service';

@Component( {
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [ './orders.component.scss' ]
} )
export class OrdersComponent implements OnInit, OnChanges {

  fields = [ 'Cliente', 'Productos', 'Monto', 'Fecha', 'Zona de Entrega',
    'Estado', 'Acción' ];

  orders: Order[] = [];
  paginate: Paginate;
  orderStatus = environment.orderStatus;
  role: string;
  status = '';
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  isUpdatable = false;
  statuses = environment.orderStatus;
  index: number;
  statusSelected = '';
  icon = 'fa fa-edit fa-lg';
  isUpdating = false;

  @Input() store: Store;

  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  /** variable provisional */

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private shopService: ShopService,
    private orderService: OrderService,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( this.auth.getUserRol() === 'merchant' ) {
        this.store = store;
      }
    } );

    this.init();
  }

  ngOnInit(): void {
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  changeStatus(): void {
    this.loadData();
  }

  // Actualiza el estado de la orden desde el listado
  updateStatus( order: Order, index: number ): void {
    this.index = index;
    this.isUpdatable = !this.isUpdatable;

    if ( this.isUpdatable ) {
      this.icon = 'fa fa-refresh fa-lg';
      this.statusSelected = order.status;
    } else {
      this.icon = 'fa fa-edit fa-lg';
    }

    if ( !this.isUpdatable ) {
      if ( this.statusSelected !== order.status ) {
        this.isUpdating = !this.isUpdating;
        this.orderService.updateStatus( { status: this.statusSelected }, order._id ).subscribe( response => {
          if ( response.message ) {
            this.isUpdating = !this.isUpdating;
            this.toastr.info( response.message[ 0 ] );
            this.icon = 'fa fa-edit fa-lg';
            this.init();
          }
        } );
      }
    }
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
    let params = '';

    // const params = `store=${this.store._id}&status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;
    if ( this.role === 'merchant' ) {
      params = `store=${this.store._id}&status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;
    }

    if ( this.role === 'admin' ) {
      params = `status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;
    }

    this.orderService.orderList( page, params ).subscribe( result => {
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }


}
