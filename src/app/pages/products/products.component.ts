import { Component, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../shared/classes/user';
import { Product } from '../../shared/classes/product';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit, OnChanges {
  typeUser = 'merchant';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', '' ];

  allProducts: Product[];
  products: Product[];
  productTypes = []; // tipos de productos
  states = []; // tipos de productos
  paginate: any = {};
  pageNo = 1;
  pageSize = 5;
  searchForm: FormGroup;
  statuses = [
    { value: 'active', text: 'Activo' },
    { value: 'inactive', text: 'Inactivo' },
    { value: 'blocked', text: 'Bloqueado' },
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.productService.productObserver().subscribe( ( product: Product ) => {
      this.loadData();
    } );
    this.loadData();
    this.createForm();
  }

  ngOnChanges(): void {
    this.loadData();
  }

  loadData(): void {
    const user: User = this.storageService.getItem( 'user' );
    this.productService.productList( user.stores[ 0 ]._id ).subscribe( ( products: Product[] ) => {
      this.allProducts = [ ...products ];
      this.getTableInformation();
    } );
  }

  createForm() {
    this.searchForm = this.formBuilder.group( {
      product: [ '' ],
      typeProduct: [ '' ],
      stateProduct: [ '' ],
      shop: [ '' ]
    } );
  }

  slicePage( items ) {
    if ( items.length > this.pageSize ) {
      return items.slice( 0, this.pageSize );
    } else {
      return items;
    }
  }

  getTableInformation() {
    // carga de datos desde api

    this.paginate = this.productService.getPager( this.allProducts.length, +this.pageNo, this.pageSize );
    this.products = this.slicePage( this.allProducts );
  }

  setPage( event ) {
    const end = event * this.paginate.pageSize;
    this.paginate.startIndex = end - this.paginate.pageSize;
    if ( event === this.paginate.endPage ) {
      this.products = this.allProducts.slice( this.paginate.startIndex );
      this.paginate.endIndex = this.allProducts.length - 1;
    } else {
      this.paginate.endIndex = end - 1;
      this.products = this.allProducts.slice( this.paginate.startIndex, this.paginate.endIndex + 1 );
    }
    this.paginate.currentPage = event;
  }

  search() {
    console.log( this.searchForm.value );
  }

}
