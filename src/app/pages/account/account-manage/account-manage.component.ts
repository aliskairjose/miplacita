import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';

@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )

export class AccountManageComponent implements OnInit {

  stores: Store[] = [];
  active = 'profile';
  user: User = {};
  subtab = 'store-profile';

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
  ) {
    this.user = this.storage.getItem( 'user' );
    this.stores = [ ...this.user.stores ];
  }

  ngOnInit(): void {
    this.route.url.subscribe( url => this.active = url[ 2 ].path );
  }

  updateTab( tab: string ) {
    this.active = tab;
    this.router.navigateByUrl( `pages/account/user/${tab}`, { skipLocationChange: false } );
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    console.log(this.subtab, this.active)
  }

  loggOut(): void {
    this.auth.logout();
  }

}
