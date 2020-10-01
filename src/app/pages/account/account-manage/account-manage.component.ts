import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopService } from '../../../shared/services/shop.service';
import { RegisterStoreComponent } from 'src/app/shared/custom-components/register-store/register-store.component';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )

export class AccountManageComponent implements OnInit, OnChanges {
  @ViewChild( 'registerNewStore' ) RegisterStore: RegisterStoreComponent;

  stores: Store[] = [];
  active = 'profile';
  user: User = {};
  subtab = 'store-profile';
  selectedStore: Store = {};
  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {}; // not null!

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private shopService: ShopService,
    private modalService: NgbModal
  ) {
    this.user = this.storage.getItem( 'user' );
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( store => {
      if ( store ) { this.init(); }
    } );
    this.init();
  }

  ngOnInit(): void {
  }

  init(): void {
    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      if ( this.active === 'admin-store' ) {
        this.subtab = url[ 3 ].path;
      }
    } );

    // Se cargas las tiendas solo de merchant
    if ( this.user.role === 'merchant' ) {
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
  }

  createStore(): void {
    console.log( 'createStore' );
    this.openModal();
  }

  updateTab( tab: string ) {
    this.active = tab;
    this.router.navigateByUrl( `pages/account/user/${tab}`, { skipLocationChange: false } );
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    this.router.navigateByUrl( `pages/account/user/${this.active}/${this.subtab}`, { skipLocationChange: false } );
  }

  loggOut(): void {
    this.auth.logout();
  }

  selectStore( store: Store ): void {
    this.selectedStore = store;
    this.shopService.storeSubject( store );
    sessionStorage.setItem( 'store', JSON.stringify( store ) );
  }

  openModal() {
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.RegisterStore, this.modalOption );
    // this.modal.result.then( ( result ) => console.log( result ) );
  }

  close() {
    this.modal.dismiss();
  }



}
