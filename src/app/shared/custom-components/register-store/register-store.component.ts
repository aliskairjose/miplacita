import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { StorageService } from '../../services/storage.service';
import { ProductService } from '../../services/product.service';
import { ShopService } from '../../services/shop.service';
import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { Product } from '../../classes/product';
import { Plan } from '../../classes/plan';
import { SuccessModalComponent } from '../../custom-component/success-modal/success-modal.component';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PaymentComponent } from '../../components/payment/payment.component';


@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  @Input() register = true;
  @Output() emitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild( 'successModal' ) SuccessModal: SuccessModalComponent;
  @ViewChild( 'payment' ) payment: PaymentComponent;

  planSelected = '';
  step = 1;
  imageLogo: any = '../../../../assets/images/marketplace/svg/upload-image.svg';;
  imageProduct: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  storeForm: FormGroup;
  productForm: FormGroup;
  submitted: boolean;
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  invalidUrl = environment.errorForm.invalidUrl;
  categories: Category[] = [];
  store: Store = {};
  plans: Plan[] = [];
  images: Array<string> = [];
  disabled = true;
  urlStore = '';
  isShow = true;
  private user: User = {};

  @Output() setBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.storeForm.controls; }
  get p() { return this.productForm.controls; }

  ngOnInit(): void {
    console.log(this.register);

    // this.user = JSON.parse( sessionStorage.userForm );

    if ( sessionStorage.registerStore ) {
      this.store = JSON.parse( sessionStorage.registerStore );
      this.step = 2;
    }

    this.shopService.getPlans().subscribe( ( plans: Plan[] ) => {
      this.plans = [ ...plans ];
      this.planSelected = this.plans[ 0 ]._id;
    } );

    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
    } );
  }

  changePlan( planPrice: number ): boolean {
    return ( planPrice !== 0 );
  }

  storeRegister() {

    this.submitted = true;

    this.storeForm.value.owner_id = this.user._id;
    if ( this.storeForm.valid && this.payment.onSubmit() ) {
      if ( this.images.length === 0 ) {
        this.toastrService.warning( 'Debe cargar un logo para la tienda!' );
        return;
      }
      this.shopService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.storeForm.value.logo = result.images[ 0 ];
          this.images.length = 0;
          this.submitted = false;
          this.createStore();
        }
      } );
    }
  }

  productRegister() {
    this.submitted = true;
    if ( this.productForm.valid ) {
      if ( this.images.length === 0 ) {
        this.toastrService.warning( 'Debe cargar una imagen para producto!' );
        return;
      }
      this.productService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.productForm.value.image = result.images[ 0 ];
          this.createProduct();
        }
      } );
    }
  }

  /**
   * @description Carga de imagen de producto
   * @param images Imagen de producto
   */
  uploadImage( images: string[] ): void {
    this.images = [ ...images ];
  }

  /**
   * @description Valida que el nombre de la tienda no este en uso
   */
  validateName(): void {

    if ( this.storeForm.value.name.length > 0 && this.storeForm.value.name.length < 4 ) {
      this.toastrService.warning( 'El nombre debe tener un mínimo de 4 caracteres' );
      return;
    }
    if ( this.storeForm.value.name ) {
      this.shopService.validateName( this.storeForm.value.name ).subscribe( resp => {
        if ( resp.taken ) {
          this.toastrService.warning( resp.message[ 0 ] );
          this.disabled = true;
          return;
        }
        this.toastrService.info( resp.message[ 0 ] );
        this.disabled = false;

      } );
    }
  }

  private createForm(): void {
    const reg = '(https?://)?(www\.)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    // Formulario de tienda
    this.storeForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      url_store: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      plan: [ '', [ Validators.required ] ],
      owner_id: [ '', [ Validators.nullValidator ] ],
      logo: [ '', [ Validators.nullValidator ] ]

    } );

    // Formulario de Producto
    this.productForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      category: [ '', [ Validators.required ] ],
      image: [ '', [ Validators.nullValidator ] ],
      store: [ '', [ Validators.nullValidator ] ],
    } );
  }

  makeUrl( valor: string ): void {
    this.urlStore = valor.toLocaleLowerCase().replace( /\s/g, '-' );
  }

  private createStore(): void {
    this.shopService.addStore( this.storeForm.value ).subscribe( ( store: Store ) => {
      this.store = { ...store };
      this.step = 2;
      sessionStorage.setItem( 'registerStore', JSON.stringify( this.store ) );
    } );
  }

  private createProduct(): void {
    this.productForm.value.store = this.store._id;
    this.productService.addProduct( this.productForm.value ).subscribe( ( product: Product ) => {
      sessionStorage.clear();
      this.openModal();
    } );
  }

  private openModal() {
    this.SuccessModal.openModal();
  }

  public back( option: number ) {
    if ( option === 0 ) {
      this.step = 1;
      this.emitEvent.emit( false );
    } else if ( option === 1 ) {
      this.step = 1;
    }
  }

}
