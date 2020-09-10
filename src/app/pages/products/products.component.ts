import { Component, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../shared/classes/user';
import { Product } from '../../shared/classes/product';
import { Result } from '../../shared/classes/response';
import { Paginate } from '../../shared/classes/paginate';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AlertService } from 'ngx-alerts';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit {
  typeUser = 'admin';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', 'Acción' ];
  searchText = '';
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
    private router: Router,
    private alert: AlertService,
    private productService: ProductService,
    private storageService: StorageService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.user = this.storageService.getItem( 'user' );
    this.loadData();

    // tslint:disable-next-line: curly
    if ( this.user.role === 'admin' ) this.fields.splice( 2, 0, 'Tienda' );
  }

  ngOnInit(): void {

    this.productService.productObserver().subscribe( ( product: Product ) => {
      this.loadData();
    } );
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
        this.alert.info( response.message[ 0 ] );
      }
      setTimeout( () => {
        this.loadData();
      }, 1500 );
    } );
  }

  private loadData( page = 1 ): void {
    // tslint:disable-next-line: curly
    if ( this.user.role === 'merchant' ) this.params = `store=${this.user.stores[ 0 ]._id}`;

    this.productService.productList( page, this.params ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
