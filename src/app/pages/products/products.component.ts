import { Component, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../shared/classes/user';
import { Product } from '../../shared/classes/product';
import { Result } from '../../shared/classes/response';
import { Paginate } from '../../shared/classes/paginate';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit {
  typeUser = 'admin';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', '' ];
  searchText = '';
  products: Product[] = [];
  productTypes = []; // tipos de productos
  states = []; // tipos de productos
  paginate: Paginate;
  statuses = [
    { value: 'active', text: 'Activo' },
    { value: 'inactive', text: 'Inactivo' },
    { value: 'blocked', text: 'Bloqueado' },
  ];
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private storageService: StorageService,
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

  private loadData( page = 1 ): void {
    ( this.user.role === 'admin' ) ? this.loadAdminProducts( page ) : this.loadUserProducts( page );
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadUserProducts( page: number ): void {
    this.productService.productList( this.user.stores[ 0 ]._id, page ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }
  private loadAdminProducts( page: number ): void {
    this.productService.getAll( page ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
