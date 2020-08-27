import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage.service';
import { ProductService } from '../../../shared/services/product.service';
import { AlertService } from 'ngx-alerts';
import { Product } from '../../../shared/classes/product';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../shared/services/store.service';
import { Category } from '../../../shared/classes/category';
import { User } from '../../../shared/classes/user';
import { environment } from '../../../../environments/environment';

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
  status: string;
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
      this.productService.uploadImages( { images: this.productImages } ).subscribe( response => {
        if ( response.status === 'isOk' ) {
          const data: Product = { ...this.productForm.value };
          data.image = [ ...response.images ] as [ string ];
          this.createProduct( data );
        }
      } );
    }

  }

  /**
   * @description Crea el producto via api
   */
  private createProduct( data: any ): void {
    this.productService.addProduct( data ).subscribe( ( product: Product ) => {
      this.alert.info( 'El producto se ha creado con exito' );
      this.productService.productSubject( product );
      setTimeout( () => {
        this.router.navigate( [ 'pages/products' ] );
      }, 3200 );
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
      category: [ this.categoryId ? this.categoryId : '', [ Validators.required ] ],
      status: [ this.statusSelected, [ Validators.required ] ],
      stock: [ '', [ Validators.required ] ],
    } );
  }

  upload( images: string[] ): void {
    this.productImages = [ ...images ];
  }

  private loadProductData( id: string ): void {
    console.log( 'loadProductData' );
    // this.productService.productDetail( id ).subscribe( response => {
    //   this.productData = response;
    // } );
  }

  updateProduct(): void {
    this.productService.updateProduct( this.productData._id, this.productForm.value ).subscribe( response => {
      this.alert.info( 'Producto actualizado correctamente' );
      setTimeout( () => {
        this.router.navigate( [ 'pages/products' ] );
      }, 3200 );
    } );
  }

}
