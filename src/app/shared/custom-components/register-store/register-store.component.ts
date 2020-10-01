import { ToastrService } from 'ngx-toastr';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { Category } from '../../classes/category';
import { Plan } from '../../classes/plan';
import { Store } from '../../classes/store';
import { User } from '../../classes/user';
import { PaymentComponent } from '../../components/payment/payment.component';
import { ProductService } from '../../services/product.service';
import { ShopService } from '../../services/shop.service';
import { forkJoin } from 'rxjs';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit, OnChanges {

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

  @Input() register = true;
  @Input() modal = false;
  @Input() _user: User = {};

  @Output() callback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setBack: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild( 'payment' ) payment: PaymentComponent;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
  ) {
    this.createForm();
  }
  ngOnChanges( changes: SimpleChanges ): void {
    if ( !sessionStorage.userForm ) {
      this.user = { ...this._user };
    }
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.storeForm.controls; }
  get p() { return this.productForm.controls; }

  ngOnInit(): void {

    if ( sessionStorage.userForm ) {
      this.user = JSON.parse( sessionStorage.userForm );
    }

    if ( sessionStorage.registerStore ) {
      this.store = JSON.parse( sessionStorage.registerStore );
      this.step = 2;
    }

    forkJoin( [ this.shopService.getPlans(), this.productService.categoryList() ] ).subscribe( ( [ plans, categories ] ) => {
      this.plans = [ ...plans ];
      this.planSelected = this.plans[ 0 ]._id;

      this.categories = [ ...categories ];
    } );

  }

  changePlan( planPrice: number ): boolean {
    return ( planPrice !== 0 );
  }

  storeRegister() {
    this.submitted = true;
    let payment = true;

    if ( this.isShow ) {
      payment = this.payment.onSubmit();
    }

    this.storeForm.value.owner_id = this.user._id;
    if ( this.storeForm.valid && payment ) {
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
      if ( !this.register ) {
        this.toastrService.info( 'Se ha creado la nueva tienda con exito' );
        this.close( true );
      } else {
        this.step = 2;
        sessionStorage.setItem( 'registerStore', JSON.stringify( this.store ) );
  
      }
    } );
  }

  private createProduct(): void {
    this.productForm.value.store = this.store._id;
    this.productService.addProduct( this.productForm.value ).subscribe( () => {
      sessionStorage.clear();
      this.router.navigate( [ '/register/success' ] );
    } );
  }

  back( option: number ) {
    if ( option === 0 ) {
      this.step = 1;
      this.callback.emit( false );
    } else if ( option === 1 ) {
      this.step = 1;
    }
  }

  close( type: boolean ): void {
    this.callback.emit( type );
  }


}
