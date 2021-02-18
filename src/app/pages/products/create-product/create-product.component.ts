
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../environments/environment';
import { Category } from '../../../shared/classes/category';
import { Plan } from '../../../shared/classes/plan';
import { Images, Product } from '../../../shared/classes/product';
import { Result } from '../../../shared/classes/response';
import { Store } from '../../../shared/classes/store';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { ModalNewElementComponent } from 'src/app/shared/components/modal-new-element/modal-new-element.component';
import { VariableProduct } from '../../../shared/classes/variable-product';
import { CategoryService } from 'src/app/shared/services/category.service';
import { STATUSES, ERROR_FORM } from '../../../shared/classes/global-constants';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
} )
export class CreateProductComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild( 'createProduct', { static: false } ) CreateProduct: TemplateRef<any>;
  @ViewChild( 'newElement' ) AddElement: ModalNewElementComponent;

  fields = [ 'Nombre', 'Precio', 'Itbms', 'Tamaño', 'Color', '' ];
  active = 'product';
  showForm = false;
  newElement = true;
  disabledBtn = true;
  deletePhoto = false;
  modal: any;
  modal2: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {};
  product: Product = {};

  create = 1;
  typesProduct = [];
  states = [];
  allVariations = [];
  subcategories = [];
  colors = [];
  deleted = [];
  color = null;
  selectedColor: VariableProduct = {};
  colorChecked = false;

  sizes = [];
  size = '';
  selectedSize: VariableProduct = {};
  sizeChecked = false;
  categoryId = '';
  categories: Category[];
  selectedSubcategory: any = {};
  productForm: FormGroup;
  variableForm: FormGroup;

  submitted: boolean;
  required = ERROR_FORM.required;
  maxStock = ERROR_FORM.maxStock;
  status = 'add';
  statuses = STATUSES;
  statusSelected = 'active';
  selectedCategory = '';
  productImages: Array<string> = [];
  images = [];
  productData: Product = {};
  title = 'Crear producto';
  disabled = true;
  plan: Plan;
  changeImage = false;
  marketplaceCheck = false;

  @Input() store: Store = {};
  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    public modalService: NgbModal,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter
  ) {
    this.createForm();
    this.productData.name = '';

  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.images = [];
    this.init();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.productForm.controls; }
  get v() { return this.variableForm.controls; }

  ngOnInit(): void {
    this.images = [];
  }

  private init(): void {

    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    const params = `store=${this.store._id}`;

    // Carga los valores base
    forkJoin( [
      this.shopService.storeList( 1, params ),
      this.productService.categoryList(),
      this.productService.getVariableProduct( this.store._id, 'color' ),
      this.productService.getVariableProduct( this.store._id, 'size' )

    ] )
      .subscribe( ( [ response, categories, colorResponse, sizeResponse ] ) => {
        this.plan = response.docs[ 0 ].plan;
        this.categories = [ ...categories ];
        this.colors = [ ...colorResponse.attributes ];
        this.sizes = [ ...sizeResponse.attributes ];

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
    const { tax, price } = this.productForm.value;

    this.productForm.value.store = this.store._id;
    this.productForm.value.tax = ( price * tax ) / 100;

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
      if ( this.changeImage && this.productImages.length ) {
        // tslint:disable-next-line: deprecation
        this.productService.uploadImages( { images: this.productImages } ).subscribe( response => {
          if ( response.status === 'isOk' ) {
            const data: Product = { ...this.productForm.value };
            data.images = [];
            response.images.forEach( ( url: string, index ) => {
              const image: Images = {};
              image.url = url;
              ( index > 0 ) ? image.principal = false : image.principal = true;
              data.images.push( image );
            } );
            this.productForm.value.images = data.images;
            ( this.status === 'add' ) ? this.createProduct( this.productForm.value ) : this.updateProduct( this.productForm.value );
          }
        } );
      } else if ( !this.changeImage ) {
        this.updateProduct( this.productForm.value );
      }
    }
    if ( this.deletePhoto && this.deleted.length ) {
      const promises = [];
      this.deleted.map( image => {
        promises.push(
          // tslint:disable-next-line: deprecation
          this.productService.deletePhoto( this.productData._id, image._id ).subscribe( ( result ) => {
            if ( result.success ) {
              this.toastrService.info( 'Foto elminada con éxito' );
            }
          } )
        );
      } );
    }
  }

  /**
   * *! Metodo sin submit para evitar conflicto con el submit del producto base
   * @description Guarda la variacion de producto!
   */
  saveVariable(): void {
    this.submitted = true;
    this.updateValidators();

    this.variableForm.get( 'store' ).setValue( this.store._id );

    if ( !this.productImages.length ) {
      this.toastrService.warning( 'Debe cargar al menos una imagen' );
      return;
    }

    if ( this.variableForm.valid ) {
      // tslint:disable-next-line: deprecation
      this.productService.uploadImages( { images: this.productImages } ).subscribe( response => {
        if ( response.status === 'isOk' ) {
          const data: Product = {};
          data.images = [];
          response.images.forEach( ( url: string, index: number ) => {
            const image: Images = {};
            image.url = url;
            ( index > 0 ) ? image.principal = false : image.principal = true;
            data.images.push( image );
          } );
          this.variableForm.value.images = data.images;
          this.createProductVariable();
        }
      } );
    }
  }

  createProductVariable(): void {
    // tslint:disable-next-line: deprecation
    this.productService.addProduct( this.variableForm.value ).subscribe( () => {
      this.toastrService.info( 'El producto variable se ha creado con exito' );
      this.reload.emit( true );
      this.close();
    } );
  }

  private updateProduct( data: Product ): void {
    // tslint:disable-next-line: deprecation
    this.productService.updateProduct( this.productData._id, data ).subscribe( ( response ) => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.reload.emit( true );
        this.close();
      }
    } );
    const promises = [];
    if ( data.images ) {
      data.images.forEach( urlimage => {
        promises.push(
          // tslint:disable-next-line: deprecation
          this.productService.addProductoPhoto( this.productData._id, { url: urlimage.url } ).subscribe( result => {
            if ( result.success ) {
              this.toastrService.info( 'Foto agregada al producto' );
            }
          } )
        );
      } );
      Promise.all( promises ).then( () => {
        // tslint:disable-next-line: deprecation
        this.productService.updateProduct( this.productData._id, data ).subscribe( ( response ) => {
          if ( response.success ) {
            this.toastrService.info( response.message[ 0 ] );
            this.reload.emit( true );
            this.close();
          }
        } );
      } );
    }
  }

  /**
   * *! Importante
   * @description Cambia las validaciones de color y size dependiendo si estan o no marcadas
   */
  private updateValidators(): void {
    if ( this.colorChecked ) {
      this.variableForm.controls.color.setValidators( [ Validators.required ] );
    } else {
      this.variableForm.get( 'color' ).setValue( null );
      this.variableForm.controls.color.clearValidators();
    }

    if ( this.sizeChecked ) {
      this.variableForm.controls.size.setValidators( [ Validators.required ] );
    } else {
      this.variableForm.get( 'size' ).setValue( null );
      this.variableForm.controls.size.clearValidators();
    }

    this.variableForm.controls.color.updateValueAndValidity();
    this.variableForm.controls.size.updateValueAndValidity();
  }


  /**
   * @description Crea el producto via api
   */
  private createProduct( data: Product ): void {
    this.clear();
    // tslint:disable-next-line: deprecation
    this.productService.addProduct( data ).subscribe( ( product: Product ) => {
      this.toastrService.info( 'El producto se ha creado con exito' );
      this.productService.productSubject( product );
      this.reload.emit( true );
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
      subcategory: [ null ],
      status: [ this.statusSelected, [ Validators.required ] ],
      deliveryDays: [ '', [ Validators.required ] ],
      stock: [ '', ],
      marketplace: [ '' ],
      images: [ '' ]
    } );

    this.variableForm = this.formBuilder.group( {
      type: [ 'variable' ], // Datos de producto variable
      parent: [ '' ], // Datos de producto variable
      color: [ '' ], // Datos de producto variable
      size: [ '' ], // Datos de producto variable
      store: [ '' ],
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      category: [ '', [ Validators.required ] ],
      status: [ this.statusSelected, [ Validators.required ] ],
      stock: [ '', [ Validators.required ] ],
      images: [ '' ],
    } );
  }

  upload( images: string[] ): void {
    this.productImages.push( ...images );
    this.changeImage = true;
  }

  private loadProductData( id: string ): void {
    // tslint:disable-next-line: deprecation
    this.productService.productList( 1, `product=${id}` ).subscribe( ( response: Result<Product> ) => {
      this.productData = { ...response.docs[ 0 ] };
      const { tax, price } = this.productData;
      // this.productData.tax = ( tax * price ) / 100;
      this.marketplaceCheck = this.productData.marketplace;
      this.images = this.productData.images;
      this.selectedCategory = this.productData.category;
      this.statusSelected = this.productData.status;
    } );
  }

  /**
   * @description Valida que el nombre del producto no este en uso
   */
  validateName(): void {
    if ( this.create === 2 ) {
      this.disabled = false;
      return;
    }

    if ( this.productData.name.length > 30 ) {
      this.toastrService.warning( 'El nombre debe tener un máximo de 30 caracteres' );
      return;
    }

    if ( this.productData.name.length > 0 && this.productData.name.length < 4 ) {
      this.toastrService.warning( 'El nombre debe tener un mínimo de 4 caracteres' );
      return;
    }
    if ( this.productData.name ) {
      // tslint:disable-next-line: deprecation
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

  choiceOptions( product: Product, option: number ) {

    switch ( option ) {
      case 1:
        this.title = 'Crear producto';
        this.active = 'product';
        this.status = 'add';
        break;
      case 2:
        this.active = 'product';
        this.status = 'edit';
        this.disabled = false;
        this.title = 'Editar producto';
        this.loadProductData( product._id );
        break;
      default:
        this.variableForm.get( 'parent' ).setValue( product._id );
        this.variableForm.get( 'category' ).setValue( product.category );
        this.title = 'Crear variante de producto';
        this.active = 'variations';
        break;
    }

  }

  openModal( option: number, product: Product ) {
    this.product = { ...product };
    this.create = option;
    this.choiceOptions( product, option );
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.CreateProduct, this.modalOption );
    this.modal.result.then( () => {
      // Cuando se envia la data cerrando el modal con el boton
    }, () => {
      // Cuando se cierra con la x de la esquina
      this.clear();
    } );
  }

  close() {
    this.clear();
    this.modal.dismiss();

  }

  private clear(): void {
    this.submitted = false;
    this.showForm = false;
    this.disabledBtn = true;
    this.colorChecked = false;
    this.sizeChecked = false;
    this.productData = {};
    this.productData.name = '';
    this.deleted = [];
    this.deletePhoto = false;

    this.variableForm.reset();

    this.productForm.reset();
    this.productForm.clearValidators();
    this.images = [];
    this.changeImage = false;

  }

  ngOnDestroy(): void {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
      this.images = [];
    }
  }

  updateActive( tab: string ) {
    this.active = tab;
  }

  variationsForm() {
    this.showForm = !this.showForm;
  }

  back() {
    this.showForm = false;
  }

  openModalNewElement( option: number ) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'customModal';
    this.modal2 = this.modalService.open( ModalNewElementComponent, this.modalOption );
    this.modal2.componentInstance.option = option;

    this.modal2.result.then( ( item ) => {
      // Cuando se envia la data cerrando el modal con el boton
      switch ( option ) {
        case 1:
          this.addVariation( item, 'size' );
          break;

        case 2:
          this.addSubCategory( item );
          break;

        default:
          this.addVariation( item, 'color' );
          break;
      }
    } );
  }

  changeCategorySelection() {
    const params = `store=${this.store._id}&category=${this.selectedCategory}`;
    // tslint:disable-next-line: deprecation
    this.categoryService.getSubcategory( params ).subscribe( subCategories => {
      this.subcategories = [ ...subCategories ];
    } );
  }

  addSubCategory( item ) {
    item[ 'category' ] = this.selectedCategory;
    item[ 'store' ] = this.store._id;

    // tslint:disable-next-line: deprecation
    this.categoryService.addSubcategory( item ).subscribe( result => {
      if ( result.success ) {
        this.subcategories.push( result.category );
      }
    } );

  }
  checkVariable( event ): void {

    if ( event.target.id === 'color' ) { this.colorChecked = event.target.checked; }
    if ( event.target.id === 'size' ) { this.sizeChecked = event.target.checked; }

    if ( this.sizeChecked || this.colorChecked ) { this.disabledBtn = false; }

    if ( !this.sizeChecked && !this.colorChecked ) { this.disabledBtn = true; }

  }

  private addVariation( data: any, type: string ): void {

    data.type = type;
    data.store = this.store._id;

    // tslint:disable-next-line: deprecation
    this.productService.addVariableProduct( data ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.init();
      }
    } );
  }

  selectVariable( variable: VariableProduct, type: string ): void {
    if ( type === 'color' ) {
      this.selectedColor = { ...variable };
      this.variableForm.value.color = this.selectedColor._id;
    } else if ( type === 'size' ) {
      this.selectedSize = { ...variable };
      this.variableForm.value.size = this.selectedSize._id;
    }

  }

  selectSubcategory( subcategory ): void {
    this.selectedSubcategory = subcategory;
    this.productForm.value.subcategory = this.selectedSubcategory._id;
  }

  variableOptionSelected( value: string ): void {
    if ( value === 'addColor' ) { this.openModalNewElement( 3 ); }
    if ( value === 'addSize' ) { this.openModalNewElement( 1 ); }
  }

  deleteImage( image ) {
    if ( image !== undefined ) {
      this.deletePhoto = true;

      for ( let i = 0; i < this.images.length; i++ ) {
        if ( this.images[ i ]._id === image._id ) {
          this.deleted.push( image );
          i = this.images.length;
        }
      }
    }
  }
}
