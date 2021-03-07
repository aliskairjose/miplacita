import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Review } from '../../classes/review';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../classes/user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

    const user: User = this.auth.getUserActive();
    this.reviewForm.value.product = this._productId;
    this.reviewForm.value.user = user._id;

    if ( this.reviewForm.valid ) {
      // tslint:disable-next-line: deprecation
      this.productService.addReview( this.reviewForm.value ).subscribe( ( review ) => {
        this.toastr.info( 'Gracias por dejar su comentario' );
        review.user = { ...user };
        this.reviews.push( review );
        this.clearForm();
      } );
    }
  }

  loadReviews( id: string ): Observable<number> {
    this._productId = id;
    return this.productService.productReviews( id ).pipe(
      map( reviews => {
        this.reviews = [ ...reviews ];
        this.clearForm();
        return this.calculateRate( reviews );
      } )
    );
  }

  private calculateRate( reviews: Review[] ): number {
    let rate = 0;
    reviews.forEach( review => {
      rate += review.qualification;
    } );
    return rate / reviews.length;
  }

  private clearForm(): void {
    this.reviewForm.reset();
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
