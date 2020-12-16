import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';
import { CartModalComponent } from '../../modal/cart-modal/cart-modal.component';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from 'src/app/shared/classes/store';
import { CommentsComponent } from '../../comments/comments.component';

@Component( {
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: [ './product-box-one.component.scss' ]
} )
export class ProductBoxOneComponent implements OnInit, AfterViewInit {

  config = '';
  productRate: 0;

  @Input() store: Store = {};
  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() thumbnail = false; // Default False
  @Input() onHowerChangeImage = false; // Default False
  @Input() cartModal = false; // Default False
  @Input() loader = false;
  @Input() search = false;
  @Input() horizontal = false;


  @ViewChild( 'quickView' ) QuickView: QuickViewComponent;
  @ViewChild( 'cartModal' ) CartModal: CartModalComponent;
  @ViewChild( 'comment', { static: false } ) comment: CommentsComponent;

  ImageSrc: string;

  constructor(
    private toastrService: ToastrService,
    private productService: ProductService,
  ) {

  }
  ngAfterViewInit(): void {
    // console.log( this.product._id );
    // Carga los comentarios del producto
  }

  ngOnInit(): void {
    this.config = window.btoa( JSON.stringify( this.store ) );
    this.productService.productAverage( this.product._id ).subscribe( avg => this.productRate = avg );
    if ( this.loader ) {
      setTimeout( () => { this.loader = false; }, 2000 ); // Skeleton Loader
    }
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

  // Change Variants
  ChangeVariants( color, product ) {
    product.variants.map( ( item ) => {
      if ( item.color === color ) {
        product.images.map( ( img ) => {
          if ( img.image_id === item.image_id ) {
            this.ImageSrc = img.src;
          }
        } );
      }
    } );
  }

  // Change Variants Image
  ChangeVariantsImage( src ) {
    this.ImageSrc = src;
  }

  addToCart( product: Product ) {
    this.productService.addToCart( product );
    this.showMessage( 'Producto agregado al carrito' );
  }

  addToWishlist( product: Product ) {
    this.productService.addToWishlist( product );
  }

  addToCompare( product: Product ) {
    this.productService.addToCompare( product );
  }

  showMessage( message ) {
    this.toastrService.info( message );
  }
}
