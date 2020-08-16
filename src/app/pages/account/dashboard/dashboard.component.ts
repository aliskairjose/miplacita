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
  public orders = [
    {
      name:"pedido 1",
      status: "pendiente",
    description: "un pedido x con muchos productos",
    price: "88.$"
    }
  ];
  public fields = [];
  public storeFields = [{name: "Pedidos"},
  {name: "Status"},
  {name: "Descripción"},
  {name: "Precio"}]
  public adminFields = [{name: "Tienda"},
  {name: "Monto"},
  {name: "Fecha"},]
  public stores = [
    {name: "tienda 1",
    amount: '45$',
    date: "12-10-2020"}
  ]
  public paginate: any = {}; // Pagination use only
  public pageNo = 1;
  constructor(public productService: ProductService) {
    if(this.typeUser == 1){
      this.fields = this.storeFields;
    }else if(this.typeUser == 2){
      this.fields = this.adminFields;
    }  
  }

  ngOnInit(): void {
    this.paginate = this.productService.getPager(this.orders.length, +this.pageNo);     // get paginate object from service

  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  setPage(event){
    console.log(event);
  }

}
