import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/tm.product.service';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from '../../shared/custom-components/order-details/order-details.component';
import { Order } from '../../shared/classes/order';
import { AlertService } from 'ngx-alerts';
import { OrderService } from '../../shared/services/order.service';
import { Store } from '../../shared/classes/store';
import { StorageService } from '../../shared/services/storage.service';
import { Paginate } from '../../shared/classes/paginate';
import { Result } from '../../shared/classes/response';
import { environment } from '../../../environments/environment';

@Component( {
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [ './orders.component.scss' ]
} )
export class OrdersComponent implements OnInit {

  fields = [ 'Cliente', 'Productos', 'Monto', 'Fecha', 'Zona de Entrega',
    'Estado', '' ];

  orders: Order[] = [];
  paginate: Paginate;
  orderStatus = environment.orderStatus;
  
  @ViewChild( "orderDetails" ) OrderDetails: OrderDetailsComponent;
  /** variable provisional */

  constructor(
    private alert: AlertService,
    private orderService: OrderService,
    private storageService: StorageService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData( page = 1 ): void {
    const store: Store[] = this.storageService.getItem( 'stores' );
    this.orderService.orderList( store[ 0 ]._id, page ).subscribe( ( result: Result<Order> ) => {
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
