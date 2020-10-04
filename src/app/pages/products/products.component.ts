import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import {
  AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';

import { environment } from '../../../environments/environment';
import { Paginate } from '../../shared/classes/paginate';
import { Plan } from '../../shared/classes/plan';
import { Product } from '../../shared/classes/product';
import { Store } from '../../shared/classes/store';
import { User } from '../../shared/classes/user';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { CreateProductComponent } from './create-product/create-product.component';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit, OnChanges, AfterViewInit {

  constructor(
    private auth: AuthService,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private productService: ProductService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.role = this.auth.getUserRol();
  }

  static isCreated = false;
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

  ngOnChanges( changes: SimpleChanges ): void {

    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( this.auth.getUserRol() === 'merchant' ) {
        this.store = store;
      }
    } );

    this.init();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if ( ( this.plan?.price === 0 ) && this.maxProducts >= 10 ) {
      alert( 'Debe cambiar de plan si quiere mas productos' );
    }
  }

  reloadData(): void {
    this.init();
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
        `¿Realmente desea borrar ${product.name}?`,
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

  private init(): void {
    if ( this.store || this.role === 'admin' ) {
      this.loadData();
    }

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

    if ( this.role === 'merchant' ) {
      this.params = `store=${this.store._id}&name=${this.name}&status=${this.status}`;
    }

    if ( this.role === 'admin' ) {
      this.params = `store=${this.storeSelected}&name=${this.name}&status=${this.status}`;
    }

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
