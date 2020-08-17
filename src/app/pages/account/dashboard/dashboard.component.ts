import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myData = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000]
  ];
  myType = "BarChart"
  public typeUser = 1;
  public openDashboard: boolean = false;
  public allOrders = [
    {
      name:"pedido 1",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 2",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },

    {
      name:"pedido 3",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 4",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 5",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 6",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 7",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 8",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 9",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 10",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 11",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 12",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 13",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 14",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },{
      name:"pedido 15",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },
    {
      name:"pedido 16",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    },  ];
  public fields = [];
  public storeFields = [{name: "Pedidos"},
  {name: "Status"},
  {name: "Descripción"},
  {name: "Precio"}]
  public adminFields = [{name: "Tienda"},
  {name: "Monto"},
  {name: "Fecha"},]
  public allStores = [
    {name: "tienda 1",
    amount: '45$',
    date: "12-10-2020"}
  ]

  public paginate: any = {}; // Pagination use only
  public pageNo = 1;
  public pageSize = 5; 
  public stores = [];
  public orders = [];
  constructor(public productService: ProductService) {
    if (this.typeUser === 1){
      this.fields = this.storeFields;
      this.paginate = this.productService.getPager(this.allOrders.length, +this.pageNo, this.pageSize );     // get paginate object from service

      this.orders = this.slicePage(this.allOrders);
    }else if (this.typeUser === 2){
      this.fields = this.adminFields;
      this.paginate = this.productService.getPager(this.allStores.length, +this.pageNo, this.pageSize );     // get paginate object from service

      this.stores = this.slicePage(this.allStores);
    }
  }

  slicePage(items){
    if (items.length > this.pageSize ){
      return items.slice(0, this.pageSize );
    } else {
      return items;
    }
  }
  ngOnInit(): void {
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  setPage(event){
    console.log("SET PAGE",event,this.paginate);
    if (event === this.paginate.endPage){
      const end = event * this.paginate.pageSize;
      this.paginate.startIndex = end - this.paginate.pageSize;
      
      if (this.typeUser === 1){
        this.orders = this.allOrders.slice(this.paginate.startIndex );
        this.paginate.endIndex = this.allOrders.length - 1;

      } else if (this.typeUser === 2) {
        this.stores = this.allStores.slice(this.paginate.startIndex);
        this.paginate.endIndex = this.allStores.length - 1;

      }
    } else {
      const end = event * this.paginate.pageSize;
      this.paginate.startIndex = end - this.paginate.pageSize;
      
      this.paginate.endIndex = end - 1;
      if (this.typeUser === 1){
        this.orders = this.allOrders.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
      } else if (this.typeUser === 2) {
        this.stores = this.allStores.slice(this.paginate.startIndex, this.paginate.endIndex + 1 );
      }
    }
 
    this.paginate.currentPage = event;

    
  }

}
