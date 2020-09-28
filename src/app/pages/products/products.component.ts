

import { environment } from '../../../environments/environment';
import { Paginate } from '../../shared/classes/paginate';
import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { Plan } from '../../shared/classes/plan';
import { AuthService } from '../../shared/services/auth.service';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild( 'createProduct' ) CreateProduct: CreateProductComponent;

  typeUser = 'admin';
  fields = [ '', 'Nombre', 'Descripción', 'Precio', 'ITBMS', 'Estado', 'Acción' ];
  name = '';
  status = '';
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
  maxProducts = 0;
  plan: Plan = {};
  role: string;
  storeSelected = '';

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
    private storageService: StorageService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.role = this.auth.getUserRol();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }
  }

  ngOnInit(): void {
    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }

    this.productService.productObserver().subscribe( () => {
      this.loadData();
    } );

    if ( this.store ) {
      const params = `store=${this.store._id}`;

      forkJoin(
        [ this.shopService.storeList( 1, params ), this.productService.productList( 1, params ) ] )
        .subscribe( ( [ storeResponse, productsResponse ] ) => {

          this.plan = storeResponse.docs[ 0 ].plan;
          this.maxProducts = productsResponse.totalDocs;

        } );
    }

    if ( this.role === 'admin' ) {
      this.fields.splice( 2, 0, 'Tienda' );
      this.shopService.storeList().subscribe( result => {
        this.shops = [ ...result.docs ];
      } );
    }

  }

  ngAfterViewInit(): void {
    if ( ( this.plan?.price === 0 ) && this.maxProducts >= 10 ) {
      alert( 'Debe cambiar de plan si quiere mas productos' );
    }
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

  deleteItem( product: Product ): void {
    this.confirmationDialogService
      .confirm(
        'Por favor confirme...',
        `¿Realmente desea borrar <b>${product.name}</b>?`,
        'Si, borrar!',
        'No borrar',
        'lg'
      )
      .then( ( confirmed ) => {
        // tslint:disable-next-line: curly
        if ( confirmed ) this.deleteProduct( product._id );
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
    ( this.role === 'merchant' )
      ? this.params = `store=${this.store._id}&name=${this.name}&status=${this.status}`
      : this.params = `store=${this.store}&name=${this.name}&status=${this.status}`;

    this.productService.productList( page, this.params ).subscribe( result => {
      this.products = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
