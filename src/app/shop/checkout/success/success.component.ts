import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';

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
    private auth: AuthService,
    private storage: StorageService,
    private orderService: OrderService,
    public productService: ProductService,
  ) {
    this.url = this.router.url;

  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.orderService.checkoutItems.subscribe( response => this.orderDetails = response );
  }

  goTo(): void {
    if ( this.url === '/shop/register/success' ) {
      const login = this.storage.getItem( 'prelogin' );
      // tslint:disable-next-line: deprecation
      this.auth.login( login ).subscribe( data => {
        this.storage.setLoginData( 'data', data );
        this.auth.authSubject( data.success );
        this.storage.removeItem( 'prelogin' );
        this.storage.removeItem( 'userForm' );
        sessionStorage.clear();
        this.router.navigate( [ '/pages/account/user/profile' ] );
      } );
    }
  }

}
