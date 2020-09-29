import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopService } from '../../../shared/services/shop.service';

@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )

export class AccountManageComponent implements OnInit, OnChanges {

  stores: Store[] = [];
  active = 'profile';
  user: User = {};
  subtab = 'store-profile';
  selectedStore: Store = {};

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private shopService: ShopService,
  ) {
    this.user = this.storage.getItem( 'user' );
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( store => {
      if ( store ) { this.init(); }
    } );
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.route.url.subscribe( url => this.active = url[ 2 ].path );
    this.shopService.getMyStores( this.user._id ).subscribe( stores => {
      const _store = JSON.parse( sessionStorage.getItem( 'store' ) );
      this.stores = [ ...stores.docs ];
      if ( _store ) {
        this.selectedStore = _store;
      } else {
        this.selectedStore = this.stores[ 0 ];
        sessionStorage.setItem( 'store', JSON.stringify( this.stores[ 0 ] ) );
      }

    } );
  }

  createStore(): void {
    console.log( 'createStore' );

  }

  updateTab( tab: string ) {
    this.active = tab;
    this.router.navigateByUrl( `pages/account/user/${tab}`, { skipLocationChange: false } );
  }

  updateSubtab( tab ) {
    this.subtab = tab;
  }

  loggOut(): void {
    this.auth.logout();
  }

  selectStore( store: Store ): void {
    this.selectedStore = store;
    this.shopService.storeSubject( store );
    sessionStorage.setItem( 'store', JSON.stringify( store ) );
  }

}
