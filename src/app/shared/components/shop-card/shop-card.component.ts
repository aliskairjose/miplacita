import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '../../classes/store';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { AuthService } from '../../services/auth.service';
import { AccountManageComponent } from 'src/app/pages/account/account-manage/account-manage.component';

@Component( {
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: [ './shop-card.component.scss' ]
} )
export class ShopCardComponent implements OnInit {

  user: User = {};

  @Input() store: Store;
  @Output() newStore: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private auth: AuthService,
    private amc: AccountManageComponent
  ) {

    this.user = this.auth.getUserActive();
  }

  ngOnInit(): void {
  }

  goToStore() {
    // this.router.navigate( [ 'pages/account/user/referrals' ] ) :
    ( this.user.role === 'client' ) ?
      this.router.navigate( [ 'pages/account/user/referrals' ], { queryParams: { storeId: this.store._id } } ) :
      this.router.navigate( [ this.store.url_store ] );
  }

  createStore(): void {
    this.newStore.emit();
  }
}
