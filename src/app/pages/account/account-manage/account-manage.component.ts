import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';

const state = {
  user: JSON.parse( localStorage.user || null )
};
@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )
export class AccountManageComponent implements OnInit {
  stores: Store[] = [];
  active = 'profile';

  constructor() {
    this.stores = [ ...state.user.stores ];
  }

  ngOnInit(): void {

  }

  updateTab( tab ) {
    this.active = tab;
  }
}
