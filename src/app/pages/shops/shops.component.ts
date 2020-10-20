import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopDetailsComponent } from '../../shared/components/shop-details/shop-details.component';
import { Paginate } from '../../shared/classes/paginate';
import { ShopService } from '../../shared/services/shop.service';
import { Store } from '../../shared/classes/store';
import { Result } from '../../shared/classes/response';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit {

  @ViewChild( 'shopDetails' ) ShopDetails: ShopDetailsComponent;

  searchText = '';
  fields = [ 'Tienda', 'Plan', 'Precio', 'Activo', 'Opciones' ];
  shops: Store[] = [];
  paginate: Paginate;


  constructor(
    public productService: ProductService,
    private shopService: ShopService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    this.shopService.storeList( page ).subscribe( ( result: Result<Store> ) => {
      this.shops = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
