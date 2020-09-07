import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component( {
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
} )
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  categories: Category[];

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

  onSubmit(): void {
    console.log( this.searchForm.value );
    // Conecta con el api de busqueda
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.searchForm.controls; }

  private createForm(): void {
    this.searchForm = this.formBuilder.group( {
      search: [ '' ]
    } );
  }


}
