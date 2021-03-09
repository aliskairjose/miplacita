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
  textCategory = 'Todos';
  textSubCategory = 'Más Vendidos';
  color = '';
  subcategories: Category[];

  @Input() store: Store = {};
  @Output() productsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges( changes: SimpleChanges ): void {

    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( q => this.searchForm.get( 'id' ).setValue( q?.id ) );

    if ( Object.entries( this.store ).length ) {
      this.loadSubCategories( this.store );
      this.searchForm.value.id = this.store._id;
    }
  }

  onSubmit(): void {
    if ( Object.entries( this.store ).length ) {
      this.searchForm.value.id = this.store._id;
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
      category: [ '' ],
      id: [ '' ],
      subcategory: [ '' ]
    } );
  }

  updateCategory( item: Category ) {
    this.textCategory = item.name;
    this.searchForm.value.category = item._id;
  }

  updateSubCategory( item: Category ) {
    this.textSubCategory = item.name;
    this.searchForm.value.subcategory = item._id;
  }

  // Carga las subcategorias de la tienda
  private loadSubCategories( store: Store ): void {
    const params = `store=${store._id}`;
    // tslint:disable-next-line: deprecation
    this.categoryService.getSubcategory( params ).subscribe( result => {
      this.subcategories = [ ...result ];
    } );
  }

}
