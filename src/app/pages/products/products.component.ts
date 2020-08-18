import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public typeUser = 'admin';
  public fields = ['ID', '', 'Nombre', 'Precio', 'Itbms',
                   'Estado', 'Vendidos', 'Principal', '' ];
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
                    id: 1,
                    image: 'assets/images/collection/4.jpg',
                    name: 'producto 1',
                    price: 12.8,
                    itbms: 4,
                    estado: 'Activo',
                    vendidos: 'jbhgvgc',
                    principal: 'si'
                  },{
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
                    id: 1,
                    image: 'assets/images/collection/4.jpg',
                    name: 'producto 1',
                    price: 12.8,
                    itbms: 4,
                    estado: 'Activo',
                    vendidos: 'jbhgvgc',
                    principal: 'si'
                  }

  ];
  public products = [];
  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 3;
  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.paginate = this.productService.getPager(this.products.length, +this.pageNo, this.pageSize );
    this.getTableInformation();
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
      this.products = this.allProducts.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
      this.paginate.endIndex = end - 1;
    }
    this.paginate.currentPage = event;
  }

}
