import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public typeUser = 'merchant';
  public fields = ['ID', '', 'Nombre', 'Precio', 'Itbms',
                   'Estado', 'Vendidos', 'Principal', '' ];
  
  public products = [];
  public productTypes = []; // tipos de productos
  public states = []; // tipos de productos

  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 5;
  /** variable provisional con data */
  public allProducts = [{
    id: 1,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 2,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },{
    id: 3,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 4,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 5,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 6,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 7,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },{
    id: 8,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 9,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 10,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  },
  {
    id: 11,
    image: 'assets/images/collection/4.jpg',
    name: 'producto 1',
    price: 12.8,
    itbms: 4,
    estado: 'Activo',
    vendidos: 'jbhgvgc',
    principal: 'si'
  }

  ];
  /*Search*/
  public searchForm: FormGroup;
  constructor(public productService: ProductService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.getTableInformation();
  }

  createForm(){
    this.searchForm = this.formBuilder.group({
      product: [''],
      typeProduct: [''],
      stateProduct: [''],
      shop:['']
    });
  }

  slicePage(items){
    if (items.length > this.pageSize ){
      return items.slice(0, this.pageSize );
    } else {
      return items;
    }
  }

  getTableInformation(){
    //** carga de datos desde api */

      this.paginate = this.productService.getPager(this.allProducts.length, +this.pageNo, this.pageSize );
      this.products = this.slicePage(this.allProducts);
  }

  setPage(event){
    const end = event * this.paginate.pageSize;
    this.paginate.startIndex = end - this.paginate.pageSize;
    if (event === this.paginate.endPage){
      this.products = this.allProducts.slice(this.paginate.startIndex );
      this.paginate.endIndex = this.allProducts.length - 1;
    } else {
      this.paginate.endIndex = end - 1;
      this.products = this.allProducts.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    }
    this.paginate.currentPage = event;
  }

  search(){
    console.log(this.searchForm.value);
  }

}
