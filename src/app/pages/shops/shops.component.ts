import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {


  public typeUser = 'admin';
  public fields = ['Tienda', 'Plan', 'Precio', 'Estado', '' ];
  public allShops = [{
                    name: "ny & co",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },
                  {
                    name: "tienda 1",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },
                  {
                    name: "tienda 3",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },
                  {
                    name: "tienda 4",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },
                  {
                    name: "miami shop",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },{
                    name: "tienda 1",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  },
                  {
                    name: "tiendita",
                    plan: "Premium",
                    price: 8.88,
                    estado: "Activo"
                  }

  ];
  public shops = [];
  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 3;
  public searchForm: FormGroup;
  public searchValid = true;
  public allShopsCopy = [];
  constructor(public productService: ProductService,
              private formBuilder: FormBuilder) { 
                this.allShopsCopy = this.allShops;

              }

  ngOnInit(): void {
    this.createForm();
    this.getTableInformation();

  }
  createForm(){
    this.searchForm = this.formBuilder.group({
      shop: ['']
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
      this.paginate.endIndex = end - 1;
      this.shops = this.allShops.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    }
    this.paginate.currentPage = event;
  }


  search(){
    // consulta a api
    console.log( this.searchForm.value.shop );
  }


}
