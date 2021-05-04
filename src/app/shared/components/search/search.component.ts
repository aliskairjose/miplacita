import { Component, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Category } from '../../classes/category';
import { Product } from '../../classes/product';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '../../classes/store';

@Component( {
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
} )
export class SearchComponent implements OnInit, OnChanges {

  searchForm: FormGroup;
  products: Product[] = [];
  textCategory = 'Explora';
  search = '';

  @Input() store: Store = {};
  @Input() categories: Category[];
  @Output() productsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit(): void {

  }

  ngOnChanges( changes: SimpleChanges ): void {

    this.route.queryParams.subscribe( q => {
      this.search = q?.name;
      this.searchForm.get( 'id' ).setValue( q?.id );
    } );

    if ( Object.entries( this.store ).length ) {
      this.searchForm.value.id = this.store._id;
    }
  }

  onSubmit(): void {
    let params = {};
    if ( Object.entries( this.store ).length ) {
      this.searchForm.value.id = this.store._id;
    }

    if ( !this.searchForm.value.name && !this.searchForm.value.category ) {
      params = { ...this.searchForm.value, page: 1 };
    } else {
      params = { ...this.searchForm.value };
    }

    // Conexión con api
    this.router.navigate( [ '/shop/collection/left/sidebar' ], { queryParams: params } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.searchForm.controls; }

  private createForm(): void {
    this.searchForm = this.formBuilder.group( {
      name: [ '' ],
      category: [ '' ],
      id: [ '' ]
    } );
  }

  updateCategory( item: Category ) {
    this.textCategory = item.name;
    this.searchForm.value.category = item._id;
  }


}
