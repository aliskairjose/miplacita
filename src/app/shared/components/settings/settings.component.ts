import { Component, OnInit, PLATFORM_ID, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../classes/product';
import { AuthService } from '../../services/auth.service';
import { PreviousRouteService } from '../../services/previous-route.service';
import { ShopService } from '../../services/shop.service';


@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
} )
export class SettingsComponent implements OnInit, OnChanges {

  products: Product[] = [];
  isLoggedIn: boolean;
  role: string;
  _role = 'client';
  balance: number;

  constructor(
    @Inject( PLATFORM_ID ) private platformId: object,
    public auth: AuthService,
    private shopService: ShopService,
    private translate: TranslateService,
    public productService: ProductService,
    private previousRoute: PreviousRouteService,
  ) {
    this.productService.cartItems.subscribe( response => { this.products = response; } );
    this.shopService.storeObserver().subscribe( store => {
      if ( store ) {
        this.getAffiliate( store._id );
      }
    } );
  }
  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit(): void {

    this.role = this.auth.getUserRol();
    this.isLoggedIn = this.auth.isAuthenticated();

    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
    } );

    if ( this.previousRoute.getCurrentUrl() === '/home/marketplace' ) {
      this._role = 'merchant';
    }
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
    this.auth.logout();
  }

  private getAffiliate( storeId: string ): void {
    this.shopService.getAffiliate( storeId, this.auth.getUserActive()._id ).subscribe( response => {
      this.balance = response.amount;
    } );
  }

}
