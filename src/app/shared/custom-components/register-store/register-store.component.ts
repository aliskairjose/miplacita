import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
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
import { Plan } from '../../classes/plan';
import { SuccessModalComponent } from '../../custom-component/success-modal/success-modal.component';
import { AuthResponse } from '../../classes/auth-response';
import { Subject } from 'rxjs';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  @ViewChild( 'successModal' ) SuccessModal: SuccessModalComponent;

  $register: Subject<boolean> = new Subject<boolean>();

  planSelected = '';
  step = 2;
  imageLogo: any = '../../../../assets/images/marketplace/svg/upload-image.svg';;
  imageProduct: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  storeForm: FormGroup;
  productForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  userId = '';
  categories: Category[] = [];
  store: Store = {};
  categoryId = '';
  user: User = {};
  plans: Plan[];
  productData: Product = {};
  storeData: Store = {};
  selectedCategory = '';
  images: Array<string> = [];

  @Output() setBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private productService: ProductService,
  ) { this.createForm(); }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.storeForm.controls; }
  get p() { return this.productForm.controls; }

  ngOnInit(): void {
    const userData = JSON.parse( sessionStorage.userForm );
    console.log( userData );

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
  }

  storeRegister() {
    this.submitted = true;
    this.storeData = { ...this.storeForm.value };
    this.storeData.plan = this.planSelected;

    if ( this.storeForm.valid ) {
      this.storeService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.storeData.logo = result.images[ 0 ];
          console.log('carga de logo tienda', result.images)
          this.step = 2;
          this.submitted = false;
        }
      } );
    }
  }

  productRegister() {
    this.submitted = true;
    this.productData = { ...this.productForm.value };
    if ( this.productForm.valid ) {
      this.productService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.productData.image = result.images[ 0 ];
          console.log('carga de imagen producto', result.images)
          this.createUser();
        }
      } );
    }
  }

  /**
   * @description Carga de imagen de producto
   * @param images Imagen de producto
   */
  uploadImage( images: string[] ): void {
    // this.productImage = [ ...images ];
    this.images = [ ...images ];
  }

  private createForm(): void {

    // Formulario de tienda
    this.storeForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      url_store: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      // logo: [ '' ],
      // owner_id: [ this.storage.getItem( 'userId' ) ],
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

  private createUser(): void {
    const userData = JSON.parse( sessionStorage.userForm );
    this.auth.register( userData ).subscribe( ( data: AuthResponse ) => {
      console.log( data )
      if ( data.success ) {
        this.storage.setItem( 'token', data.token );
        this.storeData.owner_id = data.user._id;
        console.log( 'create user', this.storeData );
        this.createStore();
      }
    } );
  }

  private createStore(): void {
    this.storeService.addStore( this.storeData ).subscribe( ( store: Store ) => {
      this.store = { ...store };
      console.log( 'createStore', this.store );
      this.createProduct();
    } );
  }

  private createProduct(): void {
    this.productData.store = this.store._id;
    this.productService.addProduct( this.productData ).subscribe( ( product: Product ) => {
      console.log('create product', product);
      this.openModal();
    } );
  }

  private openModal() {
    this.SuccessModal.openModal();
  }

  back(): void {
    this.setBack.emit( false );
  }

  backStep(): void {
    this.step = 1;
  }

}
