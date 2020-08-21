import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Plan } from '../../classes/plan';
import { SuccessModalComponent } from '../../custom-component/success-modal/success-modal.component';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  @ViewChild( 'successModal' ) SuccessModal: SuccessModalComponent;

  planSelected = '';
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
  plans: Plan[];
  productData: Product;
  storeData: Store;
  planID = '';
  selectedCategory = '';
  imageBase64: string;

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
    this.storeService.getPlans().subscribe( ( plans: Plan[] ) => {
      this.plans = [ ...plans ];
      this.planSelected = this.plans[ 0 ]._id;
    } );
    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
    } );
    this.user = this.auth.selectedUSer;
  }

  updatePlan( plan: string ) {
    this.planSelected = plan;
    this.planID = plan;
  }

  storeRegister() {
    this.submitted = true;
    this.storeData = { ...this.registerForm.value };
    this.storeData.plan = this.planID;

    if ( this.registerForm.valid ) {
      this.spinner.show();
      this.storeService.uploadImages( { images: this.imageBase64 } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.storeData.logo = result.images[ 0 ];
          this.createStore();
        }
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.danger( response.error.message );
      } );
    }
  }

  productRegister() {
    this.submitted = true;
    this.productData = { ...this.productForm.value };
    this.productData.store = this.store._id;
    if ( this.productForm.valid ) {
      this.spinner.show();
      this.productService.uploadImages( { images: this.imageBase64 } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.productData.image = result.images[ 0 ];
          this.createProduct();
        }
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.danger( response.error.message );
      } );
    }
  }

  openModal() {
    this.SuccessModal.openModal();
  }

  private createForm(): void {

    // Formulario de tienda
    this.registerForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      url_store: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      // logo: [ '' ],
      owner_id: [ this.storage.getItem( 'userId' ) ],
    } );

    // Formulario de Producto
    this.productForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      // image: [ '' ],
      category: [ this.selectedCategory, [ Validators.required ] ],
    } );
  }

  private createStore(): void {
    this.storeService.addStore( this.storeData ).subscribe( ( store: Store ) => {
      this.store = { ...store };
      this.spinner.hide();
      this.submitted = false;
      this.step = 2;
    }, ( response: HttpErrorResponse ) => {
      this.spinner.hide();
      this.alert.warning( response.error.message );
    } );
  }

  private createProduct(): void {
    this.productService.addProduct( this.productData ).subscribe( ( product: Product ) => {
      this.product = { ...product };
      this.spinner.hide();
      this.openModal();
    }, ( response: HttpErrorResponse ) => {
      this.spinner.hide();
      this.alert.warning( response.error.message );
    } );
  }

  onFileChange( event ) {
    this.imageBase64 = '';
    const image = event.target.files[ 0 ];
    const mimeType = image.type;
    if ( mimeType.match( /image\/*/ ) == null ) {
      return;
    }
    const reader = new FileReader();

    if ( event.target.files && event.target.files.length ) {
      const [ file ] = event.target.files;
      reader.readAsDataURL( file );

      reader.onload = () => { this.imageBase64 = reader.result as string; };

    }
  }

}
