import { Product } from 'src/app/shared/classes/product';
import { Result } from 'src/app/shared/classes/response';
import { Store } from 'src/app/shared/classes/store';
import { ProductSlider } from 'src/app/shared/data/slider';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShopService } from 'src/app/shared/services/shop.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Category } from '../../../shared/classes/category';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';

@Component( {
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: [ './store-page.component.scss' ]
} )
export class StorePageComponent implements OnInit {
  products: Product[] = [];
  store: Store = {};
  sliders = [];
  verticalBanners = [
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg'
  ];
  subCategories: Category[] = [];
  ProductSliderConfig: any = ProductSlider;
  color = '';

  @ViewChild( 'settings' ) setting: SettingsComponent;

  constructor(
    private route: ActivatedRoute,
    private storeService: ShopService,
    private productService: ProductService,
    private categoriesSevice: CategoryService
  ) {

    this.route.url.subscribe( ( url ) => {
      this.storeService.getStoreByUrl( url[ 0 ].path.toLocaleLowerCase() ).subscribe( store => {
        this.store = { ...store };

        if ( !sessionStorage.sessionStore ) {
          sessionStorage.setItem( 'sessionStore', JSON.stringify( store ) );
          setTimeout( () => {
            window.location.reload();
          }, 10 );
        }

        if ( sessionStorage.sessionStore ) {
          const s: Store = JSON.parse( sessionStorage.sessionStore );
          if ( s._id !== store._id ) {
            sessionStorage.setItem( 'sessionStore', JSON.stringify( store ) );
            setTimeout( () => {
              window.location.reload();
            }, 10 );
          }
        }
        this.init();

      } );
    } );

  }

  init(): void {
    this.sliders = this.store.config.images;
    this.getCollectionProducts( this.store._id );
    this.subCategoryList( this.store._id );
    this.storeService.storeSubject( this.store );
    this.storeService.customizeShop( this.store.config );
    if (this.store.config.color){
      this.color = this.store.config.color;
    } else  {
      this.color = '#c6410f';
    }
  }

  ngOnInit(): void {
  }

  // Open chat whatsapp web
  openChat(): void {
    window.open( `https://wa.me/${this.store.phone}`, '_blank' );
  }

  private getCollectionProducts( id: string ): void {
    const params = `store=${id}&featured=true`;
    this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }

  private subCategoryList( id: string ): void {
    const params = `store=${this.store._id}`;
    this.categoriesSevice.getSubcategory( params ).subscribe( subcategories => {
      this.subCategories = [ ...subcategories ];
    } );
  }

}
