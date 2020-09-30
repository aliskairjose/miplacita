import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../environments/environment';
import { Category } from '../../../shared/classes/category';
import { Plan } from '../../../shared/classes/plan';
import { Images, Product } from '../../../shared/classes/product';
import { Result } from '../../../shared/classes/response';
import { Store } from '../../../shared/classes/store';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
} )
export class CreateProductComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild( 'createProduct', { static: false } ) CreateProduct: TemplateRef<any>;
  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {}; // not null!
  create = true;
  typesProduct = [];
  states = [];
  categoryId = '';
  categories: Category[];
  productForm: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;
  status = 'add';
  statuses = [
    { value: 'active', text: 'Activo' },
    { value: 'inactive', text: 'Inactivo' },
    { value: 'blocked', text: 'Bloqueado' },
  ];
  statusSelected = 'active';
  selectedCategory = '';
  productImages: Array<string> = [];
  images = [];
  productData: Product = {};
  title = 'Crear producto';
  disabled = true;
  plan: Plan;
  store: Store = {};
  reason = '';

  @Input() _store: Store = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private productService: ProductService,
  ) {
    this.createForm();
    this.productData.name = '';
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.init();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.productForm.controls; }

  ngOnInit(): void {
  }

  private init(): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    const params = `store=${this.store._id}`;

    // tslint:disable-next-line: max-line-length
    forkJoin(
      [ this.shopService.storeList( 1, params ), this.productService.categoryList() ] )
      .subscribe( ( [ response, categories ] ) => {
        this.plan = response.docs[ 0 ].plan;
        this.categories = [ ...categories ];

        // Actualiza las valildaciones de sotck por el plan activo de la tienda
        if ( this.plan.price === 0 ) {
          this.productForm.controls.stock.setValidators( [ Validators.required, Validators.max( 10 ) ] );
        } else {
          this.productForm.controls.stock.setValidators( [ Validators.required ] );
        }
        this.productForm.controls.stock.updateValueAndValidity();
      } );
  }

  onSubmit(): void {
    this.submitted = true;
    this.productForm.value.store = this.store._id;

    if ( !this.productForm.value.marketplace ) {
      this.productForm.value.marketplace = false;
    }

    if ( this.productForm.valid ) {
      if ( this.status === 'add' ) {
        if ( this.productImages.length === 0 ) {
          this.toastrService.warning( 'Debe cargar al menos una imagen de producto' );
          return;
        }
      }
      this.productService.uploadImages( { images: this.productImages } ).subscribe( response => {
        if ( response.status === 'isOk' ) {
          const data: Product = { ...this.productForm.value };
          data.images = [];
          response.images.forEach( ( url: string ) => {
            const image: Images = {};
            image.url = url;
            image.principal = true;
            data.images.push( image );
          } );
          this.productForm.value.images = data.images;
          ( this.status === 'add' ) ? this.createProduct( this.productForm.value ) : this.updateProduct( this.productForm.value );
        }
      } );
    }
  }

  private updateProduct( data: Product ): void {
    this.productService.updateProduct( this.productData._id, data ).subscribe( response => {
      this.toastrService.info( 'Producto actualizado correctamente' );
      setTimeout( () => {
        this.router.navigate( [ 'pages/products' ] );
      }, 2000 );
    } );
  }


  /**
   * @description Crea el producto via api
   */
  private createProduct( data: Product ): void {
    this.productService.addProduct( data ).subscribe( ( product: Product ) => {
      this.toastrService.info( 'El producto se ha creado con exito' );
      this.productService.productSubject( product );
      this.close();
    } );
  }

  createForm(): void {

    this.productForm = this.formBuilder.group( {
      store: [ '' ],
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      category: [ '', [ Validators.required ] ],
      status: [ this.statusSelected, [ Validators.required ] ],
      stock: [ '' ],
      marketplace: [ '' ],
      images: [ '' ]
    } );
  }

  upload( images: string[] ): void {
    this.productImages = [ ...images ];
  }

  private loadProductData( id: string ): void {
    this.productService.productList( 1, `product=${id}` ).subscribe( ( response: Result<Product> ) => {
      this.productData = { ...response.docs[ 0 ] };
      this.selectedCategory = this.productData.category;
    } );
  }

  /**
   * @description Valida que el nombre del producto no este en uso
   */
  validateName(): void {
    if ( this.productData.name.length > 0 && this.productData.name.length < 4 ) {
      this.toastrService.warning( 'El nombre debe tener un mínimo de 4 caracteres' );
      return;
    }
    if ( this.productData.name ) {
      this.productService.validateName( this.productData.name ).subscribe( resp => {
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
  choiceOptions( productId: string ) {
    if ( !this.create ) {
      this.status = 'edit';
      this.disabled = false;
      this.title = 'Editar producto';
      this.loadProductData( productId );
    } else {
      this.title = 'Crear producto';
    }

  }
  openModal( option: boolean, id: string ) {
    this.create = option;
    this.choiceOptions( id );
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.CreateProduct, this.modalOption );
    this.modal.result.then( ( result ) => this.reason = 'adios' );
  }

  close() {
    this.productData = {};
    this.productData.name = '';
    this.productForm.reset();
    this.productForm.clearValidators();
    this.modal.close();
    this.reason = 'adios';
  }

  ngOnDestroy(): void {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }

}
