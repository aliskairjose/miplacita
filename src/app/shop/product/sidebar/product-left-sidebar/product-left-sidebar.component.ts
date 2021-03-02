import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShopService } from '../../../../shared/services/shop.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { forkJoin } from 'rxjs';
import { Store } from '../../../../shared/classes/store';
import { Category } from '../../../../shared/classes/category';
import { ViewportScroller } from '@angular/common';
import { CommentsComponent } from '../../../../shared/components/comments/comments.component';

export interface ProductDetail {
  colors?: any[];
  sizes?: any[];
}

@Component( {
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: [ './product-left-sidebar.component.scss' ]
} )
export class ProductLeftSidebarComponent implements OnInit {

  product: Product = {};
  counter = 1;
  activeSlide: any = 0;
  selectedSize: any;
  mobileSidebar = false;
  shops: Store[] = [];
  categories: Category[] = [];
  prices: any[] = [];
  today: Date = new Date();
  endDate: Date;
  sizes = [];
  colors = [];
  productDetail: ProductDetail;
  productRate = 0;
  color: any;
  size = '';
  hideFilters = false;
  storeName = '';

  @ViewChild( 'comments' ) comment: CommentsComponent;

  ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private viewScroller: ViewportScroller,
    private categoryService: CategoryService,
  ) {

    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        const decod = window.atob( queryParams.config );
        const store: Store = JSON.parse( decod );
        this.hideFilters = Object.entries( store ).length !== 0;
      }
    } );

  }


  ngOnInit(): void {
    this.spinner.show();
    const id = this.route.snapshot.paramMap.get( 'id' );
    const params = `product=${id}&status=active&data_public=true`;

    forkJoin( [
      this.shopService.storeList(),
      this.categoryService.categoryList(),
      this.productService.producVariable( id ),
      this.productService.productList( 1, params ),
      // tslint:disable-next-line: deprecation
    ] ).subscribe( ( [ shopsResult, categoriesResult, variationResult, productResult ] ) => {

      this.shops = [ ...shopsResult.docs ];
      this.categories = [ ...categoriesResult ];

      this.prices = [
        { _id: 'asc', name: 'Desde el más bajo' },
        { _id: 'desc', name: 'Desde el más alto' }
      ];

      this.product = { ...productResult.docs[ 0 ] };
      this.storeName = this.product.store.name;
      this.endDate = new Date();
      this.endDate.setDate( this.today.getDate() + parseInt( this.product.deliveryDays, 10 ) );

      // Carga los comentarios del producto
      // tslint:disable-next-line: deprecation
      this.comment.loadReviews( this.product._id ).subscribe( rate => { this.productRate = rate; } );

      if ( variationResult?.primary_key === 'color' ) {
        variationResult.keys.forEach( key => {
          this.colors.push( { value: key.value, name: key.name, products: key.products } );
        } );
        this.selectProduct( this.colors[ 0 ].products );
      }

      if ( variationResult?.primary_key === 'size' ) {
        variationResult.keys.forEach( key => {
          this.sizes.push( { value: key.value, name: key.name, product: key.products[ 0 ].product } );
        } );
        this.product = this.sizes[ 0 ].product;
        this.size = this.sizes[ 0 ].name;
      }
    } );

  }

  // Selecciona el producto por defecto a mostrar cuando hay color
  selectProduct( products: any[] ): void {
    if ( products.length ) {
      if ( products[ 0 ].key ) { this.sizes = products; }
      this.product = products[ 0 ].product;
    }
    this.color = this.product.color;
    this.size = this.product.size?.name;
  }

  /* Producto seleccionado desde las opciones de color */
  selectColor( sizes: any ): void {
    this.sizes = sizes.key ? sizes : [];
    this.product = sizes[ 0 ].product;
    this.color = this.product.color;
  }

  // Selecciona la talla desde el selector
  selectSize( size ): void {
    this.product = size;
    this.size = this.product.size.name;
  }


  // Append filter value to Url
  updateFilter( tags: any ) {
    tags.page = null; // Reset Pagination
    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    } ).finally( () => {
      this.viewScroller.setOffset( [ 120, 120 ] );
      this.viewScroller.scrollToAnchor( 'products' ); // Anchore Link
    } );
  }

  // Get Product Size
  Size( variants ) {
    const uniqSize = [];
    for ( let i = 0; i < Object.keys( variants ).length; i++ ) {
      if ( uniqSize.indexOf( variants[ i ].size ) === -1 && variants[ i ].size ) {
        uniqSize.push( variants[ i ].size );
      }
    }
    return uniqSize;
  }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    // tslint:disable-next-line: curly
    if ( this.counter > 1 ) this.counter--;
  }

  // Add to cart
  async addToCart( product: Product ) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart( product );
    if ( status ) { this.router.navigate( [ '/shop/cart' ] ); }
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
