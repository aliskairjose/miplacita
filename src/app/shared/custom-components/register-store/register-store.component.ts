import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: ['./register-store.component.scss']
})
export class RegisterStoreComponent implements OnInit {
  planSelected = 2;
  step = 1;

  constructor() { }

  ngOnInit(): void {
  }

  updatePlan(plan:number){
    this.planSelected = plan;
  }

  storeRegister(){
    //consumo de api
    // si el registro de la tienda fue exitoso
    this.step = 2;
  }

  productRegister(){
    
  }
}
