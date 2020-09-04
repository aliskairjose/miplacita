import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public products: Product[] = [];
  public categories: Category[] = [];
  public collapse: boolean = true;

  constructor(public productService: ProductService) {
    //this.productService.getProducts.subscribe(product => this.products = product);
    this.getCategories();
  }

  ngOnInit(): void {
  }

  getCategories() {
    console.log("categories");
    this.productService.categoryList().subscribe( ( categories: Category[] ) => {
      this.categories = [ ...categories ];
      console.log(categories);
    } );
  }

  // get filterbyCategory() {
  //   const category = [...new Set(this.products.map(product => product.type))]
  //   return category
  // }

}
