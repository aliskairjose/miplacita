import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from '../../shared/custom-components/order-details/order-details.component';
import { Order } from '../../shared/classes/order';
import { OrderService } from '../../shared/services/order.service';
import { Store } from '../../shared/classes/store';
import { StorageService } from '../../shared/services/storage.service';
import { Paginate } from '../../shared/classes/paginate';
import { Result } from '../../shared/classes/response';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/classes/user';
import { log } from 'console';
import { CustomDateParserFormatterService } from '../../shared/adapter/custom-date-parser-formatter.service';

@Component( {
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [ './orders.component.scss' ]
} )
export class OrdersComponent implements OnInit {

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
  private storeId = '';

  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  /** variable provisional */

  constructor(
    private ngbCalendar: NgbCalendar,
    private orderService: OrderService,
    private storageService: StorageService,
    private dateAdapter: NgbDateAdapter<string>,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnInit(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    const user: User = this.storageService.getItem( 'user' );
    this.role = user.role;
    // tslint:disable-next-line: curly
    if ( this.role === 'admin' ) this.fields.splice( 1, 0, 'Tienda' );
    this.loadData();
  }

  setPage( page: number ) {
    console.log( page );

    this.loadData( page );
  }

  changeStatus(): void {
    console.log( this.status );
    this.loadData();
  }

  filtrar(): void {
    this.fechaIni = this.parseDate.format(this.modelFrom);
    this.fechaFin = this.parseDate.format(this.modelTo);
    this.loadData();
  }

  // onDateSelect( date: NgbDate, type: string ): void {
  //   ( type === 'from' ) ? this.fechaIni = this.parseDate.format( date ) : this.fechaFin = this.parseDate.format( date );
  // }

  private loadData( page = 1 ): void {
    let params = '';

    const user: User = this.storageService.getItem( 'user' );
    const store: Store[] = user.stores;
    if ( store.length > 0 ) { this.storeId = store[ 0 ]._id; }

    params = `store=${this.storeId}&status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;

    this.orderService.orderList( page, params ).subscribe( ( result: Result<Order> ) => {
      console.log( result );
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }


}
