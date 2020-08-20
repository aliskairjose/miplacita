import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage.service';
import { ProductService } from '../../../shared/services/product.service';
import { AlertService } from 'ngx-alerts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from '../../../shared/classes/product';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
} )
export class CreateProductComponent implements OnInit {

  categories = [];
  typesProduct = [];
  states = [];
  image1: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  image2: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  image3: any = '../../../../assets/images/marketplace/svg/upload-image.svg';

  productForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';

  constructor(
    private router: Router,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private productService: ProductService,
  ) {
    this.createForm();
  }


  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.productForm.controls; }

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.productForm.valid ) {
      this.spinner.show();
      this.productService.addProduct( this.productForm.value ).subscribe( ( product: Product ) => {
        this.spinner.hide();
        this.alert.info( 'El producto se ha creado con exito' );
        this.productService.productSubject(product);
        setTimeout(() => {
          this.router.navigate(['pages/products']);
        }, 3200);
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.warning( response.error.message );
      } );
    }

  }

  createForm(): void {
    this.productForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      image: [ '', [ Validators.required ] ],
      store: [ '', [ Validators.required ] ],
      category: [ '', [ Validators.required ] ],
    } );
  }

}
