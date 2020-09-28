import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: [ './success.component.scss' ]
} )
export class SuccessComponent implements OnInit, AfterViewInit {

  public orderDetails: Order = {};
  url: string;
  constructor(
    public productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.url = this.router.url;
  }

  ngOnInit(): void {
    this.orderService.checkoutItems.subscribe( response => {
      this.orderDetails = response;
    } );
  }

  ngAfterViewInit() {

  }

}
