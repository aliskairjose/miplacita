import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { Router } from '@angular/router';
import { Result } from '../../shared/classes/response';

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
      image: 'assets/images/marketplace/images/buy.png'
    },
    {
      id: 0,
      image: 'assets/images/marketplace/images/sell.png'
    }
  ];

  constructor(
    private router: Router,
    public productService: ProductService,
  ) {
    /* 
      this.products.push(
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        },
        {
          _id: '123',
          name: 'Silla decoradora',
          store: 'Tienda',
          price: '150',
          image: [ 'assets/images/marketplace/images/placeholder.png' ],
          stock: 5,
          quantity: 1,
          category: 'Decoración'
        }
      ); 
    */
    this.getCollectionProducts();
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
    this.productService.productList().subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
    } );

  }



}
