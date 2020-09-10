import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.scss']
})
export class AccountManageComponent implements OnInit {

  constructor() { }
  active = 'profile';
  
  ngOnInit(): void {
  }

  updateTab(tab){
    this.active = tab;
  }
}
