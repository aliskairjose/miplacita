import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from 'src/app/shared/classes/user';

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
  user: User = new User();
  constructor(       
    private storage: StorageService,
  ) {
    this.user = this.storage.getItem( 'user' );
    this.stores = [ ...state.user.stores ];
  }

  ngOnInit(): void {

  }

  updateTab( tab ) {
    this.active = tab;
  }
}
