import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../classes/category';
import { Plan } from '../../classes/plan';
import { Store } from '../../classes/store';
import { User } from '../../classes/user';
import { PaymentComponent } from '../payment/payment.component';
import { ProductService } from '../../services/product.service';
import { ShopService } from '../../services/shop.service';
import { Product, Images } from '../../classes/product';
import { StorageService } from '../../services/storage.service';
import { Address } from '../../classes/order';
import { ERROR_FORM, EMAIL_PATTERN } from '../../classes/global-constants';
@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit, OnChanges {

  planSelected = '';
  // step: number;
  imageLogo: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  imageProduct: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  storeForm: FormGroup;
  submitted: boolean;
  invalidEmail = ERROR_FORM.invalidEmail;
  required = ERROR_FORM.required;
  invalidUrl = ERROR_FORM.invalidUrl;
  categories: Category[] = [];
  store: Store = {};
  plans: Plan[] = [];
  images: Array<string> = [];
  storeUrl = '';
  isShow = true;
  imageLogo1 = [];
  isValidUrl = false;
  isValidStoreName = false;
  disabled = false;
  private user: User = {};
  private emailPattern = EMAIL_PATTERN;

  @Input() step = 0;
  @Input() register = true;
  @Input() modal = false;
  @Input() _user: User = {};

  @Output() callback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setBack: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild( 'payment' ) payment: PaymentComponent;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
  ) {
    this.createForm();
  }
  ngOnChanges(): void {
    if ( !this.storage.getItem( 'userForm' ) ) {
      this.user = { ...this._user };
    }
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.storeForm.controls; }

  ngOnInit(): void {
    if ( this.storage.getItem( 'userForm' ) ) {
      this.user = this.storage.getItem( 'userForm' );
      this.step = 1;
    }

    if ( sessionStorage.registerStore ) {
      this.store = JSON.parse( sessionStorage.registerStore );
      this.step = 2;
    }

    // tslint:disable-next-line: deprecation
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
      // tslint:disable-next-line: deprecation
      this.shopService.uploadImages( { images: this.images } ).subscribe( result => {
        if ( result.status === 'isOk' ) {
          this.storeForm.value.logo = result.images[ 0 ];
          this.images.length = 0;
          this.submitted = false;
          this.createStore( payment );
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
    if ( this.storeForm.value.name ) {
      // tslint:disable-next-line: deprecation
      this.shopService.validateName( this.storeForm.value.name ).subscribe( resp => {
        if ( resp.taken ) {
          this.toastrService.warning( resp.message[ 0 ] );
          this.isValidStoreName = false;
          return;
        }
        this.toastrService.info( resp.message[ 0 ] );
        this.isValidStoreName = true;

        this.validateUrl();
      } );
    }
  }

  validateUrl(): void {
    if ( this.storeForm.value.url_store ) {
      // tslint:disable-next-line: deprecation
      this.shopService.validateUrl( this.storeForm.value.url_store ).subscribe( resp => {
        if ( resp.taken ) {
          this.toastrService.warning( resp.message[ 0 ] );
          this.isValidUrl = false;
          this.enableButton();
          return;
        }
        this.toastrService.info( resp.message[ 0 ] );
        this.isValidUrl = true;
        this.enableButton();
      } );
    }
  }

  private enableButton(): void {
    this.disabled = this.isValidStoreName && this.isValidUrl;
  }

  private createForm(): void {
    const reg = '(https?://)?(www\.)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    // Formulario de tienda
    this.storeForm = this.formBuilder.group( {
      name: [ '', [ Validators.required, Validators.minLength( 4 ) ] ],
      description: [ '', [ Validators.required ] ],
      address: [ '', [ Validators.required ] ],
      rut: [ '', [ Validators.required ] ],
      url_store: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
      plan: [ '', [ Validators.required ] ],
      owner_id: [ '', [ Validators.nullValidator ] ],
      logo: [ '', [ Validators.nullValidator ] ]

    } );

  }

  makeUrl( valor: string ): void {
    this.storeUrl = valor.toLocaleLowerCase().replace( /\s/g, '-' );
  }

  private createStore( data: any ): void {
    const DATA = { ...this.storeForm.value };
    DATA.card_number = data.tdc.card_number
    DATA.owner_card = data.tdc.owner;
    DATA.cvv_card = data.tdc.cvv;
    DATA.date_card = data.tdc.date;
    // tslint:disable-next-line: deprecation
    this.shopService.addStore( DATA ).subscribe( ( store: Store ) => {
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
