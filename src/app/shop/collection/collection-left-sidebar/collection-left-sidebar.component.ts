import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from '../../../shared/services/tm.product.service';
import { ProductService as ProductServices } from '../../../shared/services/product.service';
import { Product } from '../../../shared/classes/tm.product';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/classes/category';
import { ShopService } from '../../../shared/services/shop.service';
import { Result } from '../../../shared/classes/response';
import { Store } from '../../../shared/classes/store';
import { Product as P } from '../../../shared/classes/product';

@Component( {
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: [ './collection-left-sidebar.component.scss' ]
} )
export class CollectionLeftSidebarComponent implements OnInit {

  grid = 'col-xl-3 col-md-6';
  layoutView = 'grid-view';
  products: Product[] = [];
  categories: Category[] = [];
  shops: Store[] = [];
  brands: any[] = [];
  colors: any[] = [];
  size: any[] = [];
  minPrice = 0;
  maxPrice = 1200;
  tags: any[] = [];
  category: string;
  pageNo = 1;
  paginate: any = {}; // Pagination use only
  sortBy: string; // Sorting Order
  mobileSidebar = false;
  loader = true;
  params = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    public productService: ProductService,
    private productServices: ProductServices,
    private viewScroller: ViewportScroller,
    private categoryService: CategoryService,
  ) {
    // Get Query params..
    this.route.queryParams.subscribe( params => {
      
      this.brands = params.brand ? params.brand.split( ',' ) : [];
      this.colors = params.color ? params.color.split( ',' ) : [];
      this.size = params.size ? params.size.split( ',' ) : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [ ...this.brands, ...this.colors, ...this.size ]; // All Tags Array

      this.category = params.category ? params.category : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;

      // Get Categories 
      this.categoryService.categoryList().subscribe( ( categories: Category[] ) => {
        this.categories = [ ...categories ];
      } );

      this.shopService.getAll().subscribe( ( result: Result<Store> ) => {
        this.shops = [ ...result.docs ];
      } );

      this.loadProductList();

      // Get Filtered Products..
      this.productService.filterProducts( this.tags ).subscribe( response => {
        // Sorting Filter
        this.products = this.productService.sortProducts( response, this.sortBy );
        // Category Filter
        if ( params.category ) {
          this.products = this.products.filter( item => item.type === this.category );
        }
        // Price Filter
        this.products = this.products.filter( item => item.price >= this.minPrice && item.price <= this.maxPrice );
        // Paginate Products
        this.paginate = this.productService.getPager( this.products.length, +this.pageNo );     // get paginate object from service
        this.products = this.products.slice( this.paginate.startIndex, this.paginate.endIndex + 1 ); // get current page of items
      } );
    } );
  }

  ngOnInit(): void {
  }

  loadProductList( page = 1 ): void {
    this.productServices.productList( page, this.params ).subscribe( ( result: Result<P> ) => {
      // console.log( result );
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
    this.colors = this.colors.filter( val => val !== tag );
    this.size = this.size.filter( val => val !== tag );

    const params = {
      brand: this.brands.length ? this.brands.join( ',' ) : null,
      color: this.colors.length ? this.colors.join( ',' ) : null,
      size: this.size.length ? this.size.join( ',' ) : null
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
