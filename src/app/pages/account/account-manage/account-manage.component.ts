import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';

@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.scss']
})
export class AccountManageComponent implements OnInit {
  stores : Store[] = [];
  active = 'profile';
  
  constructor() { 
    this.stores.push({
      name:'tienda 1',
      created_at: '02-02-2020'
    },{
      name:'tienda 2',
      created_at: '02-02-2020'
    });
    console.log(this.stores);
  }
  
  ngOnInit(): void {

  }

  updateTab(tab){
    this.active = tab;
  }
}
