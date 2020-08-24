import { Component, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../shared/classes/user';
import { Product } from '../../shared/classes/product';
import { Response, Result } from '../../shared/classes/response';
import { Paginate } from '../../shared/classes/paginate';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit, OnChanges {
  typeUser = 'admin';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', '' ];
  searchText = '';
  products: Product[] = [];
  productTypes = []; // tipos de productos
  states = []; // tipos de productos
  paginate: Paginate;
  searchForm: FormGroup;
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
    this.loadData();
  }

  ngOnInit(): void {
    this.productService.productObserver().subscribe( ( product: Product ) => {
      this.loadData();
    } );

  }

  ngOnChanges(): void {
    this.loadData();
  }

  loadData( page = 1 ): void {
    this.user = this.storageService.getItem( 'user' );
    this.productService.productList( this.user.stores[ 0 ]._id, page ).subscribe( ( result: Result<Product> ) => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    });
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  search() {
    console.log( this.searchForm.value );
  }

}
