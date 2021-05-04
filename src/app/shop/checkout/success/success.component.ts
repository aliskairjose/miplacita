import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: [ './success.component.scss' ]
} )
export class SuccessComponent implements OnInit {

  public orderDetails: Order = {};
  url: string;

  constructor(
    private router: Router,
    private orderService: OrderService,
    public productService: ProductService,
  ) {
    this.url = this.router.url;

  }

  ngOnInit(): void {

    this.orderService.checkoutItems.subscribe( response => this.orderDetails = response );
  }

  goTo(): void {
    this.router.navigate( [ '/pages/account/user/profile' ] );
  }

}
