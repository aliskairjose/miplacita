import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { Result } from '../../shared/classes/response';
import { ShopService } from '../../shared/services/shop.service';

@Component( {
  selector: 'app-marketplace-shop',
  templateUrl: './marketplace-shop.component.html',
  styleUrls: [ './marketplace-shop.component.scss' ]
} )
export class MarketplaceShopComponent implements OnInit {

  products: Product[] = [];
  productCollections: any[] = [];
  options = [
    {
      id: 0,
      image: 'assets/images/marketplace/images/buy.png',
      url: '/shop/collection/left/sidebar'
    },
    {
      id: 0,
      image: 'assets/images/marketplace/images/sell.png',
      url: 'marketplace'
    }
  ];

  constructor(
    private shopService: ShopService,
    public productService: ProductService,
  ) {
    this.getCollectionProducts();
    sessionStorage.removeItem( 'sessionStore' );
  } // Fin del constructor

  ProductSliderConfig: any = ProductSlider;

  sliders = [ {
    title: '',
    subTitle: '',
    image: 'assets/images/marketplace/images/mainBanner.jpg'
  }, {
    title: '',
    subTitle: '',
    image: 'assets/images/marketplace/images/mainBanner.jpg'
  } ]

  // Collection banner
  collections = [ {
    image: 'assets/images/collection/fashion/1.jpg',
    save: 'save 50%',
    title: 'men'
  }, {
    image: 'assets/images/collection/fashion/2.jpg',
    save: 'save 50%',
    title: 'women'
  } ];

  // Blog
  blog = [ {
    image: 'assets/images/blog/1.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/2.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/3.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/4.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  } ];

  // Logo
  logo = [ {
    image: 'assets/images/logos/1.png',
  }, {
    image: 'assets/images/logos/2.png',
  }, {
    image: 'assets/images/logos/3.png',
  }, {
    image: 'assets/images/logos/4.png',
  }, {
    image: 'assets/images/logos/5.png',
  }, {
    image: 'assets/images/logos/6.png',
  }, {
    image: 'assets/images/logos/7.png',
  }, {
    image: 'assets/images/logos/8.png',
  } ];

  ngOnInit(): void {
  }

  // Product Tab collection
  private getCollectionProducts(): void {
    const params = `feature=true`;
    this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }

}
