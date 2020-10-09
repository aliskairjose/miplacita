import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
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
import { ProductsComponent } from '../products.component';
import { ModalNewElementComponent } from 'src/app/shared/components/modal-new-element/modal-new-element.component';
import { log } from 'console';

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
  modal: any;
  modal2: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {};

  create = 1;
  typesProduct = [];
  states = [];
  allVariations = [];
  subcategories = [];
  colors = [];
  color = '';
  colorChecked = false;

  sizes = [];
  size = '';
  sizeChecked = false;
  categoryId = '';
  categories: Category[];

  productForm: FormGroup;
  variableForm: FormGroup;

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

  @Input() store: Store = {};

  constructor(
    public modalService: NgbModal,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private productService: ProductService,
    public productsComponent: ProductsComponent,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter
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
  get v() { return this.variableForm.controls; }

  ngOnInit(): void {
  }

  private init(): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    const params = `store=${this.store._id}`;

    // tslint:disable-next-line: max-line-length
    forkJoin( [
      this.shopService.storeList( 1, params ),
      this.productService.categoryList()
    ] )
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
    this.modal.close();
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

  /**
   * *! Metodo sin submit para evitar conflicto con el submit del producto base
   * @description Guarda la variacion de producto!
   */
  saveVariable(): void {
    this.submitted = true;

    this.updateValidators();

    console.log( this.variableForm.valid );
    console.log( this.variableForm.value );
  }

  private updateProduct( data: Product ): void {
    this.productService.updateProduct( this.productData._id, data ).subscribe( ( response ) => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.productsComponent.reloadData();
        this.close();
      }

    } );
  }

  /**
   * *! Importante
   * @description Cambia las validaciones de color y size dependiendo si estan o no marcadas
   */
  private updateValidators(): void {
    if ( this.colorChecked ) {
      this.variableForm.controls.color.setValidators( [ Validators.required ] );
    } else {
      this.variableForm.controls.color.clearValidators();
    }

    if ( this.sizeChecked ) {
      this.variableForm.controls.size.setValidators( [ Validators.required ] );
    } else {
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
    this.productService.addProduct( data ).subscribe( ( product: Product ) => {
      this.toastrService.info( 'El producto se ha creado con exito' );
      this.productService.productSubject( product );
      this.productsComponent.reloadData();
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
    if ( this.create === 2 ) {
      this.disabled = false;
      return;
    }

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

  choiceOptions( productId: string, option: number ) {

    switch ( option ) {
      case 1:
        this.title = 'Crear producto';
        this.active = 'product';
        break;
      case 2:
        this.active = 'product';
        this.status = 'edit';
        this.disabled = false;
        this.title = 'Editar producto';
        this.loadProductData( productId );
        break;
      default:
        this.title = 'Crear variante de producto';
        this.active = 'variations';
        break;
    }

  }

  openModal( option: number, id: string, ) {
    this.create = option;
    this.choiceOptions( id, option );
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
    this.modal.dismiss();
  }

  private clear(): void {
    this.productData = {};
    this.productData.name = '';
    this.productForm.reset();
    this.productForm.clearValidators();
  }

  ngOnDestroy(): void {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
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
          this.sizes.push( item );
          break;

        case 2:
          this.subcategories.push( item );
          break;

        default:
          this.colors.push( item );
          break;
      }
    }, ( result ) => {
      // Cuando se cierra con la x de la esquina

    } );
  }

  selectVariable( event ): void {

    if ( event.target.id === 'color' ) { this.colorChecked = event.target.checked; }
    if ( event.target.id === 'size' ) { this.sizeChecked = event.target.checked; }

    if ( this.sizeChecked || this.colorChecked ) { this.disabledBtn = false; }

    if ( !this.sizeChecked && !this.colorChecked ) { this.disabledBtn = true; }

  }


}
