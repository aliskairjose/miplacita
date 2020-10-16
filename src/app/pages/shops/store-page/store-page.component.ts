import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/shared/classes/store';
import { ShopService } from 'src/app/shared/services/shop.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Result } from 'src/app/shared/classes/response';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  products: Product[] = [];
  store: Store;
  idStore: string;
  sliders = [];
  verticalBanners = [
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg',
    '../../../../assets/images/banner/1.jpg'
  ];
  constructor(
    private route: ActivatedRoute,
    private storeService: ShopService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.route.url.subscribe((url)=>{
      this.idStore = url[ 1 ].path;
    })
    this.storeService.getStore(this.idStore).subscribe((response)=>{
      console.log("store", response);
      if(response.success){
        this.store = response.result;
        this.sliders = this.store.config.images;
      }
    })
    this.getCollectionProducts();
  }
  private getCollectionProducts(): void {
    const params = `feature=true`;
    this.productService.productList(1, params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }
}
