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
import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { Product } from '../../classes/product';
import { HttpErrorResponse } from '@angular/common/http';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {

  planSelected = 2;
  step = 1;
  imageLogo: any = '../../../../assets/images/marketplace/svg/upload-image.svg';;
  imageProduct: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  registerForm: FormGroup;
  productForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  userId = '';
  categories: Category[] = [];
  store: Store;
  product: Product;
  categoryId = '';
  user: User;

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
    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
    } );
    this.user = this.auth.selectedUSer;
  }

  updatePlan( plan: number ) {
    this.planSelected = plan;
  }

  storeRegister() {
    this.submitted = true;
    if ( this.registerForm.valid ) {
      this.spinner.show();
      this.storeService.addStore( this.registerForm.value ).subscribe( ( store: Store ) => {
        this.store = { ...store };
        // this.productForm.setValue( { store: this.store._id } );
        this.productForm.value.store = this.store._id;
        this.spinner.hide();
        this.submitted = false;
        this.step = 2;
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.warning( response.error.message );
      } );
    }
  }

  productRegister() {
    console.log( ' registro de producto', this.productForm );
    // consumo de api
    this.submitted = true;
    if ( this.productForm.valid ) {
      this.spinner.show();
      this.productService.addProduct( this.productForm.value ).subscribe( ( product: Product ) => {
        this.product = { ...product };
        this.spinner.hide();
        this.step = 2;
      }, () => this.spinner.hide() );
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

    // Formulario de tienda
    this.registerForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      url_store: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      logo: [ 'logonoreal.com' ],
      owner_id: [ this.storage.getItem( 'userId' ) ],
      plan: [ '5f3e72f4c6dcbd1a01d9d255' ],
    } );

    // Formulario de Producto
    this.productForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      image: [ 'imagenprueba.com', [ Validators.required ] ],
      store: [ '' ],
      category: [ this.categoryId ? this.categoryId : '', [ Validators.required ] ],
    } );
  }

  selectCategory( id: string ): void {
    this.categoryId = id;
  }

}
