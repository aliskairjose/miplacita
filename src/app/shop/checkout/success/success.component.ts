import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';

@Component( {
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: [ './success.component.scss' ]
} )
export class SuccessComponent implements OnInit, AfterViewInit {

  public orderDetails: Order = {};
  url: string;
  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    public productService: ProductService,
  ) {
    this.url = this.router.url;
  }

  ngOnInit(): void {
    const user: User = this.userService.getUserActive();
    if ( user.fullname === 'invited_user' ) { this.auth.logout(); }
    this.orderService.checkoutItems.subscribe( response => {
      this.orderDetails = response;
    } );
  }

  ngAfterViewInit() {

  }

}
