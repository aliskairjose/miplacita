import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  constructor() {
    if(this.typeUser == 1){
      this.fields = this.storeFields;
    }else if(this.typeUser == 2){
      this.fields = this.adminFields;
    }  
  }

  ngOnInit(): void {

  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

}
