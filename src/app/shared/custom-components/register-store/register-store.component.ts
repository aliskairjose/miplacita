import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  @Output() emitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild( 'successModal' ) SuccessModal: SuccessModalComponent;

  planSelected = '';
  step = 1;
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
  product: Product = {};
  categoryId = '';
  user: User = {};
  plans: Plan[];
  productData: Product = {};
  storeData: Store = {};
  selectedCategory = '';
  images: Array<string> = [];

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

    console.log( this.storeData );

    if ( this.storeForm.valid ) {
      this.storeService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.storeData.logo = result.images[ 0 ];
          this.step = 2;
          this.submitted = false;
          console.log( this.storeData );
        }
      } );
    }
  }

  productRegister() {
    this.submitted = true;
    this.productData = { ...this.productForm.value };
    console.log( this.productData );
    if ( this.productForm.valid ) {
      this.productService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.productData.image = result.images[ 0 ];
          console.log( this.productData );
          // this.createUser();
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
      if ( data.success ) {
        this.storeData.owner_id = data.user._id;
        // this.createStore();
      }
    } );
  }

  private createStore(): void {
    this.storeService.addStore( this.storeData ).subscribe( ( store: Store ) => {
      this.store = { ...store };
      // this.createProduct();
    } );
  }

  private createProduct(): void {
    this.productData.store = this.store._id;
    this.productService.addProduct( this.productData ).subscribe( ( product: Product ) => {
      this.product = { ...product };
      this.openModal();
    } );
  }

  private openModal() {
    this.SuccessModal.openModal();
  }

  public back(option: number){
    if (option === 0){
      this.step = 1;
      this.emitEvent.emit(false);
    } else if (option === 1){
      this.step = 1;
    }
  }

}
