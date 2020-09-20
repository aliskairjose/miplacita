import { Component, OnInit, ViewChild, TemplateRef, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage.service';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/classes/product';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../../shared/classes/category';
import { User } from '../../../shared/classes/user';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../shared/classes/response';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
} )
export class CreateProductComponent implements OnInit, OnDestroy {
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


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private storageService: StorageService,
    private productService: ProductService,
    public modalService: NgbModal,
  ) {
    this.createForm();
    this.productData.name = '';
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.productForm.controls; }

  ngOnInit(): void {
    // const param = this.route.snapshot.params.id;
    // if ( param ) {
    //   this.selectedCategory = this.productData.category;
    //   this.status = 'edit';
    //   this.disabled = false;
    //   this.title = 'Editar producto';
    //   this.loadProductData( param );
    // }
    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
    } );
  }

  onSubmit(): void {
    this.submitted = true;
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
          // data.image = [ ...response.images ] as [ string ];
          data.images = [];
          response.images.forEach( element => {
            const image = { url: '', principal: false };
            image.url = element;
            image.principal = false;
            data.images.push( image );
          } );
          ( this.status === 'add' ) ? this.createProduct( data ) : this.updateProduct( data );
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
    const user: User = this.storageService.getItem( 'user' );

    this.productForm = this.formBuilder.group( {
      store: [ user.stores[ 0 ]._id, [ Validators.required ] ],
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      tax: [ '', [ Validators.required ] ],
      category: [ '', [ Validators.required ] ],
      status: [ this.statusSelected, [ Validators.required ] ],
      stock: [ '', [ Validators.required ] ],
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
    this.modal.result.then( ( result ) => console.log( result ) );
  }

  close() {
    this.modal.close();
  }

  ngOnDestroy(): void {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }

}
