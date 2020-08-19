import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { StorageService } from '../../services/storage.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  planSelected = 2;
  step = 1;
  categories = [];
  imageLogo: any = '../../../../assets/images/marketplace/svg/upload-image.svg';;
  imageProduct: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  registerForm: FormGroup;
  productForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  id = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }
  get p() { return this.productForm.controls; }

  ngOnInit(): void {
    const user: User = this.storage.getItem( 'user' );
    this.id = user.id;
  }

  updatePlan( plan: number ) {
    this.planSelected = plan;
  }

  storeRegister() {
    this.submitted = true;

    if ( this.registerForm.valid ) {
      this.storeService.addStore( this.registerForm.value ).subscribe( response => {
        this.step = 2;
        this.submitted = false;
      } );
    }
  }

  productRegister() {
    // consumo de api
    this.submitted = true;
    if ( this.productForm.valid ) {
      this.productService.addProduct( this.productForm.value ).subscribe( response => {
        this.step = 2;
      } );
    }
  }

  updateImage( $event ) {
    if ( $event.target.files.length === 0 ) {
      return;
    }

    const image = $event.target.files[ 0 ];
    const mimeType = image.type;
    if ( mimeType.match( /image\/*/ ) == null ) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( image );
    reader.onload = ( _event ) => {
      if ( this.step === 1 ) {
        this.imageLogo = reader.result;
      } else if ( this.step === 2 ) {
        this.imageProduct = reader.result;
      }
    };

  }

  private createForm(): void {

    this.registerForm = this.formBuilder.group( {

      owner_id: [ this.id ],
      url: [ '', [ Validators.required ] ],
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      logo_url: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
    } );

    this.productForm = this.formBuilder.group( {
      title: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      store_id: [ '' ],
    } );

  }

}
