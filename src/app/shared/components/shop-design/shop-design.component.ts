import { ToastrService } from 'ngx-toastr';

import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '../../classes/store';
import { ShopService } from '../../services/shop.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/classes/user';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component( {
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: [ './shop-design.component.scss' ]
} )
export class ShopDesignComponent implements OnInit, OnChanges {
  @ViewChild( 'ngcarousel', { static: true } ) ngCarousel: NgbCarousel;

  isReady = false;
  color = '';
  fontSelected = '';
  images = [];
  banners = [];
  imageLogo = [];
  bannersDelete = [];
  changeLogo = false;
  fonts = [
    { value: 'Raleway', style: { 'font-family': 'Raleway' }, name: 'Raleway Bold' },
    { value: 'Roboto', style: { 'font-family': 'Roboto', 'font-weight': 'bold' }, name: 'Roboto Bold' },
    { value: 'Source Sans Pro', style: { 'font-family': 'Source Sans Pro' }, name: 'Source Sans Pro' }
  ];

  @Input() register = false;
  @Input() store: Store;
  @Output() updateShop: EventEmitter<Store> = new EventEmitter<Store>();
  user: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {

  }
  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes.store.currentValue?.name !== changes.store.previousValue?.name ) {
      this.banners.length = 0;
      this.user = this.authService.getUserActive();
      this.getStoreInfo();
    }
  }

  ngOnInit(): void {
  }

  updateShopConfig(): void {
    // actualiza el color y la fuente si hay cambios
    if ( this.store.config.font !== this.fontSelected || this.store.config.color !== this.color ) {
      const data = { color: this.color, font: this.fontSelected };

      this.shopService.config( this.store._id, data ).subscribe( ( result ) => {
        if ( result.success ) {
          this.toastrService.info( 'Se ha actualizado el estilo de la tienda' );
          this.store.config.color = this.color;
          this.store.config.font = this.fontSelected;
          // actualizar store output
          this.updateShop.emit( this.store );
          this.isReady = true;
          this.ngOnInit();
        }
      } );
    }

    // actualiza los banners si hay banners nuevos para agregar
    if ( this.images.length ) {

      this.shopService.uploadImages( { images: this.images } ).subscribe( imageResponse => {
        if ( imageResponse.status === 'isOk' ) {
          this.images.length = 0;
          const images: string[] = [ ...imageResponse.images ];
          this.shopService.addBanners( this.store._id, images ).subscribe( result => this.toastrService.info( result.message[ 0 ] ) );
        }
      } );

    }

    // actualiza los banners si hay que eliminar alguno ya existente
    if ( this.bannersDelete.length ) {
      const images = [];
      const source = from( this.bannersDelete );
      // seleccion de propiedad _id del array de objetos con pluck RXJS
      source.pipe( pluck( '_id' ) ).subscribe( id => images.push( id ) );

      this.shopService.deleteBanners( this.store._id, images ).subscribe( result => this.toastrService.info( result.message[ 0 ] ) );
    }

    // actualiza el logo de la tienda si hay uno nuevo
    if ( this.imageLogo.length && this.changeLogo ) {
      this.updateLogo();
    }
  }

  private updateLogo() {

    this.shopService.uploadImages( { images: this.imageLogo } ).subscribe( result => {
      if ( result.status === 'isOk' ) {
        let storeData: Store = {};
        storeData = { ...this.store, logo: result.images[ 0 ] };
        this.updateStoreLogo( storeData );
      }
    } );

  }

  private updateStoreLogo( data: any ) {

    this.shopService.updateStore( this.store._id, data ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.getStoreInfo();
      }
    } );
  }
  updateConfig(): void {
    const data = { color: this.color, font: this.fontSelected };

    this.shopService.config( this.store._id, data ).subscribe( response => {
      if ( response.success ) {
        this.store = { ...response.result };
        this.toastrService.info( response.message[ 0 ] );
        this.updateShop.emit( this.store );
      }
    } );
  }

  sendImageToCloud(): void {

    this.shopService.uploadImages( { images: this.images } ).subscribe( result => {
      if ( result.status === 'isOk' ) {
        // result.images[ 0 ];

        this.shopService.addBanner( this.store._id, result.images[ 0 ] ).subscribe( _result => {
          if ( _result.success ) {
            this.toastrService.info( _result.message[ 0 ] );
          }
        } );
      }
    } );
  }

  /**
   * @description Carga la imagenes del banner
   * @param images Banners
   */
  uploadBanner( images: string[] ): void {
    const _images = [ ...this.images ];
    this.images = [ ...images, ..._images ];
  }

  /**
   * @description Carga un nuevo logo a la tienda
   * @param images Nuevo logo
   */
  uploadLogo( images: string[] ): void {
    this.changeLogo = true;
    this.imageLogo = [ ...images ];
  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  deleteBanner( image ) {
    if ( image !== undefined ) {
      this.bannersDelete.push( image );
    }
  }

  getStoreInfo() {
    const params = `store=${this.store._id}&owner_id=${this.user._id}`;

    this.shopService.storeList( 1, params ).subscribe( ( response ) => {
      const tmpStore = response.docs[ 0 ];
      this.color = tmpStore.config.color;
      this.banners = tmpStore.config.images;
      this.fontSelected = tmpStore.config.font;
      this.imageLogo = [ tmpStore.logo ];
      this.store = tmpStore;
      this.updateShop.emit( this.store );
    } );
  }

  async endRegister() {
    const login = await this.login();
    if ( login ) {
      this.router.navigateByUrl( '/shop/register/success' );
    }
  }

  private login(): Promise<boolean> {
    return new Promise<boolean>( resolve => {
      const login = this.storage.getItem( 'prelogin' );

      this.auth.login( login ).subscribe( data => {
        this.storage.setLoginData( 'data', data );
        this.auth.authSubject( data.success );
        this.storage.removeItem( 'prelogin' );
        this.storage.removeItem( 'userForm' );
        sessionStorage.clear();
        resolve( true );
      } );
    } );
  }

  toStore(): void {
    this.router.navigate( [ this.store.url_store ], { queryParams: { mode: 'edit' } } );
  }

}
