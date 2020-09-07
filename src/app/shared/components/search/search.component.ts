import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component( {
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
} )
export class SearchComponent implements OnInit, OnChanges {

  searchForm: FormGroup;
  categories: Category[];
  selected = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      this.categories = [ ...response ];
    } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
  }

  onSubmit(): void {
    // Conexión con api
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
