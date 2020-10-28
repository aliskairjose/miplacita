import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/shared/classes/store';
import { ShopService } from 'src/app/shared/services/shop.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Result } from 'src/app/shared/classes/response';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component( {
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: [ './store-page.component.scss' ]
} )
export class StorePageComponent implements OnInit {
  products: Product[] = [];
  store: Store = {};
  sliders = [];
  categories = [];

  constructor(
    private route: ActivatedRoute,
    private storeService: ShopService,
    private productService: ProductService,
    private categoriesSevice: CategoryService ) {
      
     }

  ngOnInit(): void {
    this.route.url.subscribe( ( url ) => {
      const name = url[ 0 ].path.replace( '-', ' ' );
      this.storeService.getStoreByName( name ).subscribe( store => {
        this.store = { ...store };
        console.log(this.store);
        this.sliders = this.store.config.images;
        this.getCollectionProducts( this.store._id );

        this.getSubcateories( this.store._id );
        this.storeService.storeSubject( this.store );
      } );
    } );
  }

  private getCollectionProducts( id: string ): void {
    const params = `store=${id}&featured=true`;
    this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }

  private getSubcateories( id: string ): void {
    this.categoriesSevice.getSubcategoriesByStore(id).subscribe( ( result: any ) => {
      console.log(result);
      this.categories =  result ;
    } );

  }
}
