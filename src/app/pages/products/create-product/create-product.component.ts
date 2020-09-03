import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage.service';
import { ProductService } from '../../../shared/services/product.service';
import { AlertService } from 'ngx-alerts';
import { Product } from '../../../shared/classes/product';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../shared/services/shop.service';
import { Category } from '../../../shared/classes/category';
import { User } from '../../../shared/classes/user';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../shared/classes/response';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
} )
export class CreateProductComponent implements OnInit {

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
  productImages: string[] = [];
  images = [];
  productData: Product = {};
  title = 'Crear producto';
  disabled = true;


  constructor(
    private router: Router,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private productService: ProductService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.productForm.controls; }

  ngOnInit(): void {
    const param = this.route.snapshot.params.id;
    if ( param ) {
      this.selectedCategory = this.productData.category;
      this.status = 'edit';
      this.disabled = false;
      this.title = 'Editar producto';
      this.loadProductData( param );
    }
    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
    } );
  }

  onSubmit(): void {
    this.submitted = true;
    if ( this.productForm.valid ) {
      if(this.productImages.length === 0) {
        this.alert.warning('Debe cargar al menos una imagen de producto');
        return;
      }
      this.productService.uploadImages( { images: this.productImages } ).subscribe( response => {
        if ( response.status === 'isOk' ) {
          const data: Product = { ...this.productForm.value };
          data.image = [ ...response.images ] as [ string ];
          ( this.status === 'add' ) ? this.createProduct( data ) : this.updateProduct( data );
        }
      } );
    }
  }

  private updateProduct( data: Product ): void {
    this.productService.updateProduct( this.productData._id, data ).subscribe( response => {
      this.alert.info( 'Producto actualizado correctamente' );
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
      this.alert.info( 'El producto se ha creado con exito' );
      this.productService.productSubject( product );
      setTimeout( () => {
        this.router.navigate( [ 'pages/products' ] );
      }, 2000 );
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
    this.productService.productDetail( id ).subscribe( ( response: Result<Product> ) => {
      this.productData = { ...response.docs[ 0 ] };
      this.selectedCategory = this.productData.category;
    } );
  }

  /**
   * @description Valida que el nombre del producto no este en uso
   */
  validateName(): void {
    if ( this.productData.name.length > 0 && this.productData.name.length < 4 ) {
      this.alert.warning( 'El nombre debe tener un mínimo de 4 caracteres' );
      return;
    }
    if ( this.productData.name ) {
      this.productService.validateName( this.productData.name ).subscribe( resp => {
        if ( resp.taken ) {
          this.alert.warning( resp.message[ 0 ] );
          this.disabled = true;
          return;
        }
        this.alert.info( resp.message[ 0 ] );
        this.disabled = false;

      } );
    }
  }

}
