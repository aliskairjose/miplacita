import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild( 'sizeChart' ) SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private spinner: NgxSpinnerService,
    public productService: ProductService,
    private viewScroller: ViewportScroller,
    private categoryService: CategoryService,
  ) {

  }

  ngOnInit(): void {
    this.spinner.show();
    forkJoin( [ this.shopService.getAll(), this.categoryService.categoryList() ] ).subscribe( ( [ shopsResult, categoriesResult ] ) => {
      this.shops = [ ...shopsResult.docs ];
      this.categories = [ ...categoriesResult ];
      this.prices = [
        { _id: 'asc', name: 'Desde el más bajo' },
        { _id: 'desc', name: 'Desde el más alto' }
      ];

      const id = this.route.snapshot.paramMap.get( 'id' );
      const params = `product=${id}`;

      this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
        this.spinner.hide();
        this.product = { ...result.docs[ 0 ] };
      } );
    } );

  }

  // Append filter value to Url
  updateFilter( tags: any ) {
    // console.log( tags );
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
    // product.quantity = this.counter || 1;
    // const status = await this.productService.addToCart( product );
    // if ( status )
    //   this.router.navigate( [ '/shop/cart' ] );
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

}
