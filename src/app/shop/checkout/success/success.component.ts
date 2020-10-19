import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';

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
    private storage: StorageService,
    private orderService: OrderService,
    public productService: ProductService,
  ) {
    this.url = this.router.url;

  }

  ngOnInit(): void {
    this.orderService.checkoutItems.subscribe( response => {
      this.orderDetails = response;
    } );
  }

  goTo(): void {
    if ( this.url === '/shop/register/success' ) {
      const login = JSON.parse( sessionStorage.prelogin );
      this.auth.login( login ).subscribe( data => {
        this.storage.setLoginData( 'data', data );
        this.auth.authSubject( data.success );
        this.router.navigate( [ '/pages/account/user/profile' ] );
      } );
    }
  }
  ngAfterViewInit() {

  }

}
