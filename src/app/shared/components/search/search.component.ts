import { Component, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { Product } from '../../classes/product';

@Component( {
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
} )
export class SearchComponent implements OnInit, OnChanges {

  searchForm: FormGroup;
  products: Product[] = [];
  selected = '';

  @Input() categories: Category[];
  @Output() productsFilter: EventEmitter<Product[]> = new EventEmitter<Product[]>();

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit(): void {

  }

  ngOnChanges( changes: SimpleChanges ): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
  }

  onSubmit(): void {
    // Conexión con api
    this.productsFilter.emit( this.products );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.searchForm.controls; }

  private createForm(): void {
    this.searchForm = this.formBuilder.group( {
      search: [ '' ],
      category: [ '' ],
    } );
  }


}
