import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Review } from '../../classes/review';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../classes/user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component( {
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: [ './comments.component.scss' ]
} )
export class CommentsComponent implements OnInit {

  reviewForm: FormGroup;
  submitted: boolean;
  reviews: Review[] = [];
  rating = 0;
  disabledReview = false;

  private _user: User = {};
  private _productId = '';

  constructor(
    public auth: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {
    this.createForm();
    this._user = this.auth.getUserActive();

  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.reviewForm.controls; }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;

    // this._user = this.auth.getUserActive();
    this.reviewForm.value.product = this._productId;
    this.reviewForm.value.user = this._user._id;

    if ( this.reviewForm.valid ) {

      this.productService.addReview( this.reviewForm.value ).subscribe( ( review ) => {
        this.toastr.info( 'Gracias por dejar su comentario' );
        review.user = { ...this._user };
        this.reviews.push( review );
        this.clearForm();
      } );
    }
  }

  loadReviews( id: string ): Observable<number> {
    if ( id ) {
      this._productId = id;
      return this.productService.productReviews( id ).pipe(
        map( reviews => {
          this.reviews = [ ...reviews ];
          // Con some  comprueba si al menos un elemento del array cumple con la condición implementada por la función proporcionada.
          this.disabledReview = reviews.some( r => r.user._id === this._user._id );
          this.clearForm();
          return this.calculateRate( reviews );
        } )
      );
    }
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
