import { Component, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

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
  private storeId = '';

  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  /** variable provisional */

  constructor(
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private orderService: OrderService,
    private storageService: StorageService,
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

  ngOnChanges( changes: SimpleChanges ): void {
    console.log( 'oncghanges' );

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

  setPage( page: number ) {
    this.loadData( page );
  }

  changeStatus(): void {
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

  private loadData( page = 1 ): void {
    let params = '';

    const user: User = this.storageService.getItem( 'user' );
    const store: Store[] = user.stores;
    if ( store.length > 0 ) { this.storeId = store[ 0 ]._id; }

    params = `store=${this.storeId}&status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;

    this.orderService.orderList( page, params ).subscribe( ( result: Result<Order> ) => {
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }


}
