import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-suscription',
  templateUrl: './shop-suscription.component.html',
  styleUrls: ['./shop-suscription.component.scss']
})
export class ShopSuscriptionComponent implements OnInit {
  public shop: any;
  public plan: any = {name: 'plan oro'};
  public benefits = ['10 productos máximos', 'Tienda propia', 'Catálogo virtual'];
  constructor() { }

  ngOnInit(): void {
  }

  cancelPlan(){

  }

  changePlan(){

  }
}
