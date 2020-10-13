import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from '../../../../shared/components/modal/size-modal/size-modal.component';
import { Result } from '../../../../shared/classes/response';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShopService } from '../../../../shared/services/shop.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { forkJoin } from 'rxjs';
import { Store } from '../../../../shared/classes/store';
import { Category } from '../../../../shared/classes/category';
import { ViewportScroller } from '@angular/common';
import { CommentsComponent } from '../../../../shared/components/comments/comments.component';

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

  @ViewChild( 'sizeChart' ) SizeChart: SizeModalComponent;
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
  }

  ngOnInit(): void {
    this.spinner.show();
    const id = this.route.snapshot.paramMap.get( 'id' );
    const params = `product=${id}`;

    forkJoin( [
      this.shopService.storeList(),
      this.categoryService.categoryList(),
      this.productService.producVariable( id ),
      this.productService.productList( 1, params ),
    ] ).subscribe( ( [ shopsResult, categoriesResult, variationResult, productResult ] ) => {

      this.shops = [ ...shopsResult.docs ];
      this.categories = [ ...categoriesResult ];
      this.prices = [
        { _id: 'asc', name: 'Desde el más bajo' },
        { _id: 'desc', name: 'Desde el más alto' }
      ];

      this.product = { ...productResult.docs[ 0 ] };
      this.endDate = new Date();
      this.endDate.setDate( this.today.getDate() + parseInt( this.product.deliveryDays, 10 ) );
      this.comment.loadReviews( this.product._id );

      console.log( variationResult );
    } );

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

  // Get Product Color
  Color( variants ) {
    const uniqColor = [];
    for ( let i = 0; i < Object.keys( variants ).length; i++ ) {
      if ( uniqColor.indexOf( variants[ i ].color ) === -1 && variants[ i ].color ) {
        uniqColor.push( variants[ i ].color );
      }
    }
    return uniqColor;
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

  selectSize( size ) {
    this.selectedSize = size;
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
  async addToCart( product: any ) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart( product );
    if ( status ) { this.router.navigate( [ '/shop/cart' ] ); }
  }

  // Buy Now
  async buyNow( product: any ) {
    // product.quantity = this.counter || 1;
    // const status = await this.productService.addToCart( product );
    // if ( status )
    //   this.router.navigate( [ '/shop/checkout' ] );
  }

  // Add to Wishlist
  addToWishlist( product: any ) {
    // this.productService.addToWishlist( product );
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  ChangeVariants( color, product ) {
    console.log( 'variante de color' );
  }

}
