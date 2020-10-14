import { ToastrService } from 'ngx-toastr';

import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '../../../shared/classes/store';
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
  fonts = [
    { value: 'Raleway Bold', name: 'Raleway Bold' },
    { value: 'Roboto Bold', name: 'Roboto Bold' },
    { value: 'Source Sans Pro', name: 'Source Sans Pro' }
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
      this.store = store;
      if(this.store.config.color){
        this.color = this.store.config.color;
      }
      this.fontSelected = this.store.config.font;
    } );
  }

  ngOnInit(): void {
    // const user: User = this.storage.getItem( 'user' );
    // this.store = user.stores[ 0 ];
    console.log("store",this.store);
    this.banners = this.store.config.images;
    this.imageLogo = [this.store.logo];
   console.log(this.imageLogo, this.banners)
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
    
    if(this.bannersDelete.length){
      console.log("eliminar");
      for(let image of this.bannersDelete){
        this.shopService.deleteBanner(this.store._id,image._id).subscribe((result)=>{
          console.log("delete", result);

          if(result.success){
            console.log("success");

          }
        })

      }
    }
    
    if(this.imageLogo.length){
      this.updateLogo();
    } else{

      this.updateConfig();
    }
  }
  updateLogo(){
    this.shopService.uploadImages( { images: this.imageLogo } ).subscribe( result => {
      if ( result.status === 'isOk' ) {
        let updateStore = { 
          logo: result.images[ 0 ],
          name: this.store.name,
          description: this.store.description,
          // currency: this.store.currency,

        };
        this.updateStoreLogo(updateStore);
      }
    } );

  
  }

  updateStoreLogo(data: any){
    
    this.shopService.updateStore( this.store._id,data).subscribe( response => {
      console.log("updateStore", response);
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
        console.log("tienda",response);
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
          console.log( _result );
        } );
      }
    } );
  }

  /**
   * @description Carga la imagenes del banner
   * @param images Banners
   */
  uploadBanner( images: string[] ): void {
    console.log( images );

    this.images = [ ...images ];
  }

  uploadLogo( images: string[] ): void {
    this.imageLogo = [ ...images ];
  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  deleteBanner( image ) {
    this.bannersDelete.push(image);
    console.log("delete banner",image, this.bannersDelete);

  }

  deleteLogo(image){
    console.log("delete logo",image);

  }

}
