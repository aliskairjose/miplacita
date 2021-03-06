import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShopService } from '../../../../shared/services/shop.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { Store } from '../../../../shared/classes/store';
import { Category } from '../../../../shared/classes/category';
import { Location, ViewportScroller } from '@angular/common';
import { CommentsComponent } from '../../../../shared/components/comments/comments.component';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

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
  seeMore = true;

  private config: any;

  @ViewChild( 'comments' ) comment: CommentsComponent;
  @ViewChild( NgbCarousel, { static: true } ) ngcarousel: NgbCarousel;

  ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(
    private router: Router,
    public location: Location,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private viewScroller: ViewportScroller,
    private categoryService: CategoryService,
  ) {

    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        this.config = queryParams.config;
        const store: Store = JSON.parse( queryParams.config );
        this.hideFilters = Object.entries( store ).length !== 0;
      }
    } );

  }

  async ngOnInit() {
    this.spinner.show();
    const id = this.route.snapshot.paramMap.get( 'id' );
    const params = `product=${id}&status=active&data_public=true`;
    this.prices = [
      { _id: 'asc', name: 'De menor a mayor' },
      { _id: 'desc', name: 'De mayor a menor' }
    ];

    const shops = await this.stores();
    this.shops = [ ...shops ];

    const categories = await this.categoryList();
    this.categories = [ ...categories ];

    const variationResult = await this.productVariableList( id );
    this.product = await this.productList( params );
    this.comment.loadReviews( this.product._id ).subscribe( rate => { this.productRate = rate; } );

    this.storeName = this.product.store.name;
    this.endDate = new Date();
    this.endDate.setDate( this.today.getDate() + parseInt( this.product.deliveryDays, 10 ) );

    if ( variationResult[ 0 ]?.primary_key === 'color' ) {
      variationResult[ 0 ].keys.forEach( key => {
        this.colors.push( { value: key.value, name: key.name, products: key.products } );
      } );
      this.selectProduct( this.colors[ 0 ].products );
    }

    if ( variationResult[ 0 ]?.primary_key === 'size' ) {
      variationResult[ 0 ].keys.forEach( key => {
        this.sizes.push( { value: key.value, name: key.name, product: key.products[ 0 ].product } );
      } );
      this.product = this.sizes[ 0 ].product;
      this.size = this.sizes[ 0 ].name;
    }

  }

  private async stores(): Promise<any[]> {
    return new Promise<any[]>( resolve => {
      this.shopService.storeList().subscribe( ( result ) => resolve( result.docs ) );
    } );
  }

  private async categoryList(): Promise<any[]> {
    return new Promise<any[]>( resolve => {
      this.categoryService.categoryList().subscribe( categories => resolve( categories ) );
    } );
  }

  private async productVariableList( id: string ) {
    return new Promise( resolve => {
      this.productService.producVariable( id ).subscribe( result => resolve( result ) );
    } );
  }

  private async productList( params: any ): Promise<any> {
    return new Promise<any>( resolve => {
      this.productService.productList( 1, params ).subscribe( result => resolve( result.docs[ 0 ] ) );
    } );
  }


  // Selecciona el producto por defecto a mostrar cuando hay color
  selectProduct( products: any[] ): void {
    const { store } = this.product;
    if ( products.length ) {
      if ( products[ 0 ].key ) { this.sizes = products; }
      this.product = products[ 0 ].product;
    }
    this.color = this.product.color;
    this.size = this.product.size?.name;
    this.product.store = store;
  }

  /* Producto seleccionado desde las opciones de color */
  selectColor( sizes: any ): void {
    const { store } = this.product;
    this.sizes = sizes.key ? sizes : [];
    this.product = sizes[ 0 ].product;
    this.color = this.product.color;
    this.product.store = store;
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
  addToCart( product: Product ) {
    product.quantity = this.counter || 1;
    const status = this.productService.addToCart( product );
    if ( status ) { this.router.navigate( [ '/shop/cart' ] ); }
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  imageSeleted( index: number ): void {
    this.ngcarousel.select( `ngb-slide-${index}` );
  }

  get productDescription(): string {
    return this.product.description;
  }

}
