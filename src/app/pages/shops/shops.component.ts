import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {


  public typeUser = 'admin';
  public fields = ['Tienda', 'Plan', 'Precio', 'Estado', '' ];
  public allShops = [{
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
  public shops = [];
  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 3;
  constructor(public productService: ProductService) { }
  

  ngOnInit(): void {
    this.paginate = this.productService.getPager(this.shops.length, +this.pageNo, this.pageSize );
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

      this.paginate = this.productService.getPager(this.allShops.length, +this.pageNo, this.pageSize );
      this.shops = this.slicePage(this.allShops);
  }

  setPage(event){
    const end = event * this.paginate.pageSize;
    this.paginate.startIndex = end - this.paginate.pageSize;
    if (event === this.paginate.endPage){
      this.shops = this.allShops.slice(this.paginate.startIndex );
      this.paginate.endIndex = this.allShops.length - 1;
    } else {
      this.shops = this.allShops.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
      this.paginate.endIndex = end - 1;
    }
    this.paginate.currentPage = event;
  }
}
