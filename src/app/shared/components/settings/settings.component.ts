import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/tm.product.service";
import { Product } from "../../classes/tm.product";
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
} )
export class SettingsComponent implements OnInit {

  products: Product[] = [];
  isLoggedIn: boolean;

  /*  public languages = [{ 
     name: 'English',
     code: 'en'
   }, {
     name: 'French',
     code: 'fr'
   }]; */

  /* public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Rupees',
    currency: 'INR',
    price: 70.93 // price of inr
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }] */

  constructor(
    @Inject( PLATFORM_ID ) private platformId: Object,
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private translate: TranslateService,
    public productService: ProductService,
  ) {
    this.productService.cartItems.subscribe( response => this.products = response );
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      if (isAuth){
        this.isLoggedIn = isAuth;
      }
    } );
  }

  changeLanguage( code ) {
    if ( isPlatformBrowser( this.platformId ) ) {
      this.translate.use( code );
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem( product: any ) {
    this.productService.removeCartItem( product );
  }

  changeCurrency( currency: any ) {
    this.productService.Currency = currency;
  }

  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.storage.clearAll();
    this.router.navigate( [ 'home/marketplace' ] );
  }

}
