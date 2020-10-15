import { ToastrService } from 'ngx-toastr';

import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { Store, Config } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';
import { forkJoin } from 'rxjs';

@Component( {
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: [ './shop-design.component.scss' ]
} )
export class ShopDesignComponent implements OnInit, OnChanges {
  @ViewChild( 'ngcarousel', { static: true } ) ngCarousel: NgbCarousel;

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

  @Input() store: Store;
  @Output() updateShop: EventEmitter<Store> = new EventEmitter<Store>();

  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
  ) {

  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      console.log( store );

      this.store = store;
      this.color = this.store.config.color;
      this.banners = this.store.config.images;
      this.imageLogo = [ this.store.logo ];

      this.fontSelected = this.store.config.font;
    } );
  }

  ngOnInit(): void {
  }

  updateShopConfig(): void {
    const data = { color: this.color, font: this.fontSelected };

    if ( this.images.length ) {
      forkJoin( [
        this.shopService.config( this.store._id, data ),
        this.shopService.uploadImages( { images: this.images } )
      ] ).subscribe( ( [ configResponse, imageResponse ] ) => {
        if ( configResponse.success ) {

          this.store = { ...configResponse.result };
          this.toastrService.info( configResponse.message[ 0 ] );
        }

        if ( imageResponse.status === 'isOk' ) {
          this.shopService.addBanner( this.store._id, { url: imageResponse.images[ 0 ] } ).subscribe( _result => {
            if ( _result.success ) { this.toastrService.info( _result.message[ 0 ] ); }
          } );
        }
      } );
      this.updateShop.emit( this.store );

    }

    if ( this.bannersDelete.length ) {
      for ( const image of this.bannersDelete ) {
        this.shopService.deleteBanner( this.store._id, image._id ).subscribe( ( result ) => {
          if ( result.success ) { this.toastrService.info( result.message[ 0 ] ); }
        } );
      }
    }

    if ( this.imageLogo.length && this.changeLogo ) {
      this.updateLogo();
    } else {
      this.updateConfig();
    }
  }

  updateLogo() {
    this.shopService.uploadImages( { images: this.imageLogo } ).subscribe( result => {
      if ( result.status === 'isOk' ) {
        const updateStore = {
          logo: result.images[ 0 ],
          name: this.store.name,
          description: this.store.description,

        };
        this.updateStoreLogo( updateStore );
      }
    } );

  }

  updateStoreLogo( data: any ) {

    this.shopService.updateStore( this.store._id, data ).subscribe( response => {
      if ( response.success ) {
        this.store = { ...response.store };
        this.toastrService.info( response.message[ 0 ] );
        this.updateShop.emit( this.store );
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
    this.images = [ ...images ];
  }

  uploadLogo( images: string[] ): void {
    this.changeLogo = true;
    this.imageLogo = [ ...images ];
  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  deleteBanner( image ) {
    this.bannersDelete.push( image );

  }


}
