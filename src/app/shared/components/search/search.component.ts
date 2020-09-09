import { Component, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { Product } from '../../classes/product';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
} )
export class SearchComponent implements OnInit, OnChanges {

  searchForm: FormGroup;
  products: Product[] = [];

  @Input() categories: Category[];
  // @Output() productsFilter: EventEmitter<Product[]> = new EventEmitter<Product[]>();
  @Output() productsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
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
    this.router.navigate( [ '/shop/collection/left/sidebar' ], { queryParams: this.searchForm.value } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.searchForm.controls; }

  private createForm(): void {
    this.searchForm = this.formBuilder.group( {
      name: [ '' ],
      category: [ '' ],
    } );
  }


}
