

import { environment } from '../../../environments/environment';
import { Paginate } from '../../shared/classes/paginate';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../shared/classes/user';
import { Product } from '../../shared/classes/product';
import { Result } from '../../shared/classes/response';
import { Store } from '../../shared/classes/store';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { ToastrService } from 'ngx-toastr';
import { CreateProductComponent } from './create-product/create-product.component';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit {
  @ViewChild( 'createProduct' ) CreateProduct: CreateProductComponent;

  typeUser = 'admin';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', 'Acción' ];
  name = '';
  status = '';
  store = '';
  shops: Store[] = [];
  products: Product[] = [];
  productTypes = []; // tipos de productos
  states = []; // tipos de productos
  paginate: Paginate;
  standardImage = environment.standardImage;
  statuses = [
    { value: 'active', text: 'Activo' },
    { value: 'inactive', text: 'Inactivo' },
    { value: 'blocked', text: 'Bloqueado' },
  ];
  user: User;
  params = '';

  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
    private storageService: StorageService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.user = this.storageService.getItem( 'user' );

    if ( this.user.stores.length || this.user.role === 'admin' ) {
      this.loadData();
    }

    // tslint:disable-next-line: curly
    if ( this.user.role === 'admin' ) this.fields.splice( 2, 0, 'Tienda' );
  }

  ngOnInit(): void {

    this.productService.productObserver().subscribe( ( product: Product ) => {
      this.loadData();
    } );

    this.shopService.getAll().subscribe( ( result: Result<Store> ) => {
      this.shops = [ ...result.docs ];
    } );
  }

  search(): void {
    this.loadData();
  }

  selectStatus(): void {
    this.loadData();
  }

  selectShop(): void {
    this.loadData();
  }

  showModal( id: string ): void {
    this.confirmationDialogService
      .confirm( 'Por favor confirme ..', '¿Realmente desea eliminar este producto?' )
      .then( ( confirmed ) => {
        // tslint:disable-next-line: curly
        if ( confirmed ) this.deleteProduct( id );
      } );

  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private deleteProduct( id: string ): void {
    this.productService.deleteProduct( id ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
      }
      setTimeout( () => {
        this.loadData();
      }, 1500 );
    } );
  }

  private loadData( page = 1 ): void {
    ( this.user.role === 'merchant' )
      ? this.params = `store=${this.user.stores[ 0 ]._id}&name=${this.name}&status=${this.status}`
      : this.params = `store=${this.store}&name=${this.name}&status=${this.status}`;

    this.productService.productList( page, this.params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }

      console.log( this.products );

    } );
  }

}
