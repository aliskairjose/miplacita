import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  constructor() {
    this.orders.push( {
      _id: '123',
      amount: 1000,
      status: 'Entregado',
      created_at: '02-02-2020',
      store: {name: 'tienda2'}
    },{
      _id: '123',
      amount: 1000,
      status: 'Entregado',
      created_at: '02-02-2020',
      store: {name: 'tienda2'}
    });
   }

  ngOnInit(): void {
  }

}
