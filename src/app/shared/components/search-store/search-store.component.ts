import { Component, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Category } from '../../classes/category';
import { Product } from '../../classes/product';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '../../classes/store';
import { ShopService } from '../../services/shop.service';
import { CategoryService } from '../../services/category.service';

@Component( {
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  styleUrls: [ './search-store.component.scss' ]
} )
export class SearchStoreComponent implements OnInit, OnChanges {
  searchForm: FormGroup;
  products: Product[] = [];
  subCategoryTitle = 'Todos';
  priceFilterText = 'Rango de precio';
  color = '';
  subcategories: Category[];
  filterOptions = [
    { value: 'asc', text: 'Desde el más bajo' },
    { value: 'desc', text: 'Desde el más alto' },
  ];

  @Input() store: Store = {};
  @Output() productsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( Object.entries( store ).length ) {
        this.loadSubCategories( store );
      }
    } );
    this.createForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.route.queryParams.subscribe( q => {
      if ( q.id ) {
        this.searchForm.get( 'id' ).setValue( q.id );
      }
    } );

    if ( Object.entries( this.store ).length ) {
      this.loadSubCategories( this.store );
      this.searchForm.value.store = this.store._id;
    }
  }

  onSubmit(): void {
    if ( Object.entries( this.store ).length ) {
      this.searchForm.value.store = this.store._id;
    }
    // Conexión con api
    this.router.navigate( [ '/shop/collection/left/sidebar' ], { queryParams: this.searchForm.value } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.searchForm.controls; }

  private createForm(): void {
    this.searchForm = this.formBuilder.group( {
      name: [ '' ],
      store: [ '' ],
      subcategory: [ '' ],
      price_order: [ '' ]
    } );
  }

  updatePriceFilter( item ) {
    this.searchForm.value.price_order = item.value;
    this.priceFilterText = item.text;
  }

  updateSubCategory( item: Category ) {
    this.subCategoryTitle = item.name;
    this.searchForm.value.subcategory = item._id;
  }

  // Carga las subcategorias de la tienda
  private loadSubCategories( store: Store ): void {
    const params = `store=${store._id}`;

    this.categoryService.getSubcategory( params ).subscribe( result => {
      if ( result.length === 0 ) {
        console.log( 'vacio' )
        this.subcategories = [ { _id: '', name: 'No hay categorías disponibles' } ];
        return;
      }
      this.subcategories = [ ...result ];
    } );
  }

}
