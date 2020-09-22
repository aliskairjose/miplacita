import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Store } from '../../../shared/classes/store';
import { User } from '../../../shared/classes/user';
import { Result } from '../../../shared/classes/response';

@Component( {
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: [ './user-orders.component.scss' ]
} )
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  private _user: User = {};

  constructor(
    private storage: StorageService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this._user = this.storage.getItem( 'user' );
    this.loadData();
  }

  loadData( page = 1 ): void {
    const params = `user=${this._user._id}`;
    this.orderService.orderList( page, params ).subscribe( ( result: Result<Order> ) => {
      this.orders = [ ...result.docs ];
    } );

  }

}
