import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ProductService } from '../../services/product.service';
import { Review } from '../../classes/review';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../classes/product';
import { User } from '../../classes/user';

@Component( {
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: [ './comments.component.scss' ]
} )
export class CommentsComponent implements OnInit, OnChanges, OnDestroy {

  reviewForm: FormGroup;
  submitted: boolean;
  reviews: Review[] = [];
  rating = 0;

  private _productId = '';

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.reviewForm.controls; }

  ngOnChanges( changes: SimpleChanges ): void {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.submitted = true;

    const user: User = this.storage.getItem( 'user' );
    this.reviewForm.value.product = this._productId;
    this.reviewForm.value.user = user._id;

    if ( this.reviewForm.valid ) {
      this.productService.addReview( this.reviewForm.value ).subscribe( ( review ) => {
        this.toastr.info( 'Gracias por dejar su comentario' );
        this.reviews.push( review );
      } );
    }
  }

  loadReviews( id: string ): void {
    
    this._productId = id;
    this.productService.productReviews( id ).subscribe( reviews => {
      this.reviews = [ ...reviews ];
    } );
  }

  private createForm(): void {
    this.reviewForm = this.formBuilder.group( {
      user: [ '' ],
      qualification: [ '', [ Validators.required ] ],
      commentary: [ '', [ Validators.required ] ],
      product: [ '' ],
    } );
  }


}
