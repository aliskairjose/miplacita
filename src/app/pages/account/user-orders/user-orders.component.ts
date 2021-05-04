import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { User } from '../../../shared/classes/user';
import { Result } from '../../../shared/classes/response';
import { AuthService } from '../../../shared/services/auth.service';
import { Paginate } from '../../../shared/classes/paginate';
import { OrderDetailsComponent } from '../../../shared/components/order-details/order-details.component';

@Component( {
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: [ './user-orders.component.scss' ]
} )
export class UserOrdersComponent implements OnInit {

  fields = [
    'Tienda',
    'Total',
    'Fecha de emisión',
    'Entrega estimada',
    'Estado',
    'Acción'
  ];
  orders: Order[] = [];
  paginate: Paginate;
  private _user: User = {};

  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this._user = this.auth.getUserActive();
    this.loadData();
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  loadData( page = 1 ): void {
    const params = `user=${this._user._id}`;

    this.orderService.orderList( page, params ).subscribe( ( result: Result<Order> ) => {
      this.orders = [ ...result.docs ];
      this.paginate = { ...result, pages: [] };

      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );

  }

}
