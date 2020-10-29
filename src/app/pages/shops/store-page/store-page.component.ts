import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/shared/classes/store';
import { ShopService } from 'src/app/shared/services/shop.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Result } from 'src/app/shared/classes/response';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from '../../../shared/classes/category';

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

  constructor(
    private route: ActivatedRoute,
    private storeService: ShopService,
    private productService: ProductService,
    private categoriesSevice: CategoryService
  ) {

    this.route.url.subscribe( ( url ) => {
      this.storeService.getStoreByUrl( url[ 0 ].path.toLocaleLowerCase() ).subscribe( store => {
        sessionStorage.setItem( 'sessionStore', JSON.stringify( store ) );

        this.store = { ...store };
        this.sliders = this.store.config.images;
        this.getCollectionProducts( this.store._id );
        this.subCategoryList( this.store._id );
      } );
    } );

  }


  ngOnInit(): void {
  }

  private getCollectionProducts( id: string ): void {
    const params = `store=${id}&featured=true`;
    this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }

  private subCategoryList( id: string ): void {
    this.categoriesSevice.getSubcategory( this.store._id ).subscribe( subCategories => {
      this.subCategories = [ ...subCategories ];
    } );
  }

}
