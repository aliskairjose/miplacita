import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from '../../../../shared/components/modal/size-modal/size-modal.component';
import { Result } from '../../../../shared/classes/response';
import { NgxSpinnerService } from 'ngx-spinner';

@Component( {
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: [ './product-left-sidebar.component.scss' ]
} )
export class ProductLeftSidebarComponent implements OnInit {

  public product: Product = {};
  public counter = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar = false;

  @ViewChild( 'sizeChart' ) SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public productService: ProductService,
  ) {

  }

  ngOnInit(): void {
    this.spinner.show();
    const id = this.route.snapshot.paramMap.get( 'id' );
    const params = `product=${id}`;

    this.productService.productList( 1, params ).subscribe( ( result: Result<Product> ) => {
      this.spinner.hide();
      this.product = { ...result.docs[ 0 ] };
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
    const uniqSize = []
    for ( let i = 0; i < Object.keys( variants ).length; i++ ) {
      if ( uniqSize.indexOf( variants[ i ].size ) === -1 && variants[ i ].size ) {
        uniqSize.push( variants[ i ].size )
      }
    }
    return uniqSize
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
