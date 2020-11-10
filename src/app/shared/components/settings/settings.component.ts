import { Component, OnInit, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../classes/product';
import { AuthService } from '../../services/auth.service';
import { PreviousRouteService } from '../../services/previous-route.service';
import { ShopService } from '../../services/shop.service';
import { Store } from 'src/app/shared/classes/store';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
} )
export class SettingsComponent implements OnInit {

  products: Product[] = [];
  isLoggedIn: boolean;
  role: string;
  _role = 'client';
  balance: number;
  showBalance = false;
  store: Store = {};
  private _referedCode: string;

  constructor(
    @Inject( PLATFORM_ID ) private platformId: object,
    public auth: AuthService,
    private toast: ToastrService,
    private shopService: ShopService,
    private translate: TranslateService,
    public productService: ProductService,
    private previousRoute: PreviousRouteService,
    private _clipboardService: ClipboardService,
  ) {
    this.productService.cartItems.subscribe( response => { this.products = response; } );
  }

  ngOnInit(): void {
    this._clipboardService.copyResponse$.subscribe( re => {
      if ( re.isSuccess ) {
        this.toast.info( 'El código se ha copiado al portapapeles!' );
      }
    } );

    this.role = this.auth.getUserRol();
    this.isLoggedIn = this.auth.isAuthenticated();

    this.shopService.storeObserver().subscribe( store => {

      if ( store && this.auth.getUserActive() && this.auth.getUserRol() === 'client' ) {
        this.store = store;
        this.getAffiliate( store._id );
      }
    } );

    if ( sessionStorage.sessionStore ) {
      this.store = JSON.parse( sessionStorage.sessionStore );

      if ( this.auth.getUserActive() && this.auth.getUserRol() === 'client' ) {
        this.getAffiliate( this.store._id );
      }
    }

    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
    } );

    if ( this.previousRoute.getCurrentUrl() === '/home/marketplace' ) {
      this._role = 'merchant';
    }
    // console.log( this.store );
  }

  callServiceToCopy() {
    this._clipboardService.copy( this._referedCode );
  }

  changeLanguage( code ) {
    if ( isPlatformBrowser( this.platformId ) ) {
      this.translate.use( code );
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  get getBalance(): number {
    return this.balance;
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
    this.showBalance = true;

    this.shopService.getAffiliate( storeId, this.auth.getUserActive()._id ).subscribe( response => {
      this.balance = response.amount;
      this._referedCode = response.code;
    } );
  }

}
