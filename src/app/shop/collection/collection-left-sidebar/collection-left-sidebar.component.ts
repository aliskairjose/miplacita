import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/classes/category';
import { ShopService } from '../../../shared/services/shop.service';
import { Result } from '../../../shared/classes/response';
import { Store } from '../../../shared/classes/store';
import { Product } from '../../../shared/classes/product';
import { forkJoin } from 'rxjs';
import { Paginate } from '../../../shared/classes/paginate';

const state = {
  sessionStore: JSON.parse( sessionStorage.sessionStore || null ),
};

@Component( {
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: [ './collection-left-sidebar.component.scss' ]
} )
export class CollectionLeftSidebarComponent implements OnInit {

  grid = 'col-lg-12';
  layoutView = 'list-view';
  products: Product[] = [];
  categories: Category[] = [];
  shops: Store[] = [];
  brands: any[] = [];
  prices: any[] = [];
  tags: any[] = [];
  category: string;
  pageNo = 1;
  paginate: Paginate;
  sortBy: string; // Sorting Order
  mobileSidebar = false;
  loader = true;
  params: string;
  noData = false;
  hideFilters = false;

  private _storeId = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService,
    private viewScroller: ViewportScroller,
    private categoryService: CategoryService,
  ) {
    forkJoin( [ this.shopService.storeList(), this.categoryService.categoryList() ] )
      .subscribe( ( [ shopsResult, categoriesResult ] ) => {
        // Get Query params..
        this.route.queryParams.subscribe( params => {
          if ( params.id ) {
            this.shopService.getStore( params.id ).subscribe( ( store: Store ) => this.shopService.customizeShop( store.config ) );
          }

          this._storeId = params.id;
          if ( params.store ) { this.hideFilters = true; }

          const shops = [ ...shopsResult.docs ];
          const categories = [ ...categoriesResult ];
          const prices = [
            { _id: 'asc', name: 'Desde el más bajo' },
            { _id: 'desc', name: 'Desde el más alto' }
          ];

          let shopTag = [];
          let catTag = [];
          let priceTag = [];

          const p = window.location.href.split( '?' );
          this.params = p[ 1 ];

          const storeID = params.store ? params.store.split( ',' ) : [];
          if ( storeID.length > 0 ) {
            this.shops = shops.filter( x => x._id === storeID[ 0 ] );
            if(this.shops[0]){
               shopTag.push( this.shops[ 0 ].name );
            }

          } else {
            this.shops = [ ...shops ];
            shopTag = [];
          }

          const categoryID = params.category ? params.category.split( ',' ) : [];
          if ( categoryID.length > 0 ) {
            this.categories = categories.filter( x => x._id === categoryID[ 0 ] );
            catTag.push( this.categories[ 0 ].name );
          } else {
            this.categories = [ ...categories ];
            catTag = [];
          }

          const priceID = params.price_order ? params.price_order.split( ',' ) : [];
          if ( priceID.length > 0 ) {
            this.prices = prices.filter( x => x._id === priceID[ 0 ] );
            priceTag.push( this.prices[ 0 ].name );
          } else {
            this.prices = [ ...prices ];
            priceTag = [];
          }

          this.tags = [ ...shopTag, ...catTag, ...priceTag ]; // All Tags Array

          this.loadProductList( params?.page );

        } );
      } );

  }

  ngOnInit(): void {

  }

  loadProductList( page = 1 ): void {
    this.params = `${this.params}&stock=true&status=active&data_public=true`;

    this.productService.productList( page, this.params ).subscribe( ( result: Result<Product> ) => {

      if ( this._storeId ) {
        this.products = result.docs.filter( item => item.store._id === this._storeId );
      } else {
        this.products = [ ...result.docs ];
      }

      ( this.products.length ) ? this.noData = false : this.noData = true;

      this.paginate = { ...result, pages: [] };

      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
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

  // SortBy Filter
  sortByFilter( value ) {
    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    } ).finally( () => {
      this.viewScroller.setOffset( [ 120, 120 ] );
      this.viewScroller.scrollToAnchor( 'products' ); // Anchore Link
    } );
  }

  // Remove Tag
  removeTag( tag ) {
    this.brands = this.brands.filter( val => val !== tag );

    const params = {
      brand: this.brands.length ? this.brands.join( ',' ) : null,
      categories: this.categories.length ? this.categories.join( ',' ) : null
    };

    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    } ).finally( () => {
      this.viewScroller.setOffset( [ 120, 120 ] );
      this.viewScroller.scrollToAnchor( 'products' ); // Anchore Link
    } );
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    } ).finally( () => {
      this.viewScroller.setOffset( [ 120, 120 ] );
      this.viewScroller.scrollToAnchor( 'products' ); // Anchore Link
    } );
  }

  // product Pagination
  setPage( page: number ) {
    this.router.navigate( [], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    } ).finally( () => {
      this.viewScroller.setOffset( [ 120, 120 ] );
      this.viewScroller.scrollToAnchor( 'products' ); // Anchore Link
    } );
  }

  // Change Grid Layout
  updateGridLayout( value: string ) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView( value: string ) {
    this.layoutView = value;
    if ( value === 'list-view' ) {
      this.grid = 'col-lg-12';
    }
    else {
      this.grid = 'col-xl-3 col-md-6';
    }
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
