import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/shared/classes/store';
import { ShopService } from 'src/app/shared/services/shop.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Result } from 'src/app/shared/classes/response';

@Component( {
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: [ './store-page.component.scss' ]
} )
export class StorePageComponent implements OnInit {
  products: Product[] = [];
  store: Store = {};
  sliders = [];
  categories = [ { name: 'Mas Vendidos' }, { name: 'accesorios' } ];
  verticalBanners = [
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg'
  ];
  constructor(
    private route: ActivatedRoute,
    private storeService: ShopService,
    private productService: ProductService ) {
  }

  ngOnInit(): void {
    this.route.url.subscribe( ( url ) => {
      this.storeService.getStoreByUrl( url[ 0 ].path.toLocaleLowerCase() ).subscribe( store => {
        this.store = { ...store };
        this.sliders = this.store.config.images;
        this.getCollectionProducts( this.store._id );
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
}
