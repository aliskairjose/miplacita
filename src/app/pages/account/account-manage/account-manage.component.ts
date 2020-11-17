import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopService } from '../../../shared/services/shop.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment.prod';
import { RegisterStoreComponent } from '../../../shared/components/register-store/register-store.component';

@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )

export class AccountManageComponent implements OnInit, OnChanges {
  @ViewChild( 'registerNewStore' ) RegisterStore: RegisterStoreComponent;

  standardImage = environment.standardImage;
  stores: Store[] = [];
  active = 'profile';
  user: User = {};
  subtab = 'store-profile';
  selectedStore: Store = {};
  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {}; // not null!

  clientOptions = [
    { name: 'Mi Perfil', id: 'user-icon', key: 'profile', icon: 'assets/images/marketplace/images/icons/profile.png' },
    { name: 'Mis Órdenes', key: 'orders', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Mis Tiendas', key: 'stores', icon: 'assets/images/marketplace/images/icons/store.png' },
    // { name: 'Referidos', key: 'referrals', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Tarjetas', key: 'card', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Ayuda', id: 'big-icon', key: 'support', icon: 'assets/images/marketplace/images/icons/help.png' },

  ];
  adminStoreOptions = [
    { name: 'Mi Perfil', id: 'user-icon', key: 'profile', icon: 'assets/images/marketplace/images/icons/profile.png' },
    { name: 'Tablero', key: 'dashboard', icon: 'assets/images/marketplace/images/icons/tablero.png' },
    { name: 'Productos', key: 'products', icon: 'assets/images/marketplace/images/icons/productos.png' },
    { name: 'Órdenes', key: 'admin-orders', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Perfil de tienda', key: 'admin-store', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Mis Tiendas', key: 'stores', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Tarjetas', key: 'card', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Reportes', key: 'reports', icon: 'assets/images/marketplace/images/icons/report.png' },
    { name: 'Ayuda', id: 'big-icon', key: 'support', icon: 'assets/images/marketplace/images/icons/help.png' },
  ];
  adminOptions = [
    { name: 'Mi Perfil', id: 'user-icon', key: 'profile', icon: 'assets/images/marketplace/images/icons/profile.png' },
    { name: 'Tablero', key: 'dashboard', icon: 'assets/images/marketplace/images/icons/tablero.png' },
    { name: 'Productos', key: 'products', icon: 'assets/images/marketplace/images/icons/productos.png' },
    { name: 'Órdenes', key: 'admin-orders', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Tiendas', key: 'stores', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Comisiones', key: 'commissions', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Planes', key: 'plans', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Reportes', key: 'reports', icon: 'assets/images/marketplace/images/icons/report.png' },
    { name: 'Términos y condiciones', key: 'terms', icon: 'assets/images/marketplace/images/icons/report.png' },

  ];

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private shopService: ShopService,
    private modalService: NgbModal
  ) {
    this.user = this.auth.getUserActive();
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.init();
  }

  ngOnInit(): void {
    this.init();
  }

  reload( event: boolean ): void {
    if ( event ) { this.init(); }
  }

  init(): void {
    let provisionalSubtab = '';
    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      if ( this.active === 'admin-store' && url.length > 3 ) {
        provisionalSubtab = url[ 3 ].path;
        // this.subtab = 'design';
      } else if ( this.active === 'admin-store' && url.length === 3 ) {
        provisionalSubtab = 'store-profile';
      }
      if ( this.active === 'profile' && url.length > 3 ) {
        this.active = 'profile';
      }
    } );

    // Se cargas las tiendas solo de merchant
    if ( this.user.role === 'merchant' || this.user.role === 'client' ) {

      this.shopService.getMyStores( this.user._id ).subscribe( stores => {
        if ( stores.docs.length ) {
          const _store = JSON.parse( sessionStorage.getItem( 'store' ) );
          this.stores = [ ...stores.docs ];
          this.subtab = provisionalSubtab;
          if ( _store ) {
            this.selectedStore = _store;
          } else {
            this.selectedStore = this.stores[ 0 ];
            sessionStorage.setItem( 'store', JSON.stringify( this.stores[ 0 ] ) );
          }
          this.shopService.storeSubject( this.selectedStore );
        }

      } );
    }
  }

  createStore(): void {
    this.openModal();
  }

  updateTab( tab: string ) {
    this.active = tab;
    if ( this.active === 'reports' ) {
      if ( this.user.role === 'merchant' ) {
        this.updateSubtab( 'daily-sales' );
      } else {
        this.updateSubtab( 'sales-mp' );
      }
    } else if ( this.active === 'admin-store' ) {
      this.subtab = 'store-profile';
    } else {
      this.router.navigateByUrl( `pages/account/user/${tab}`, { skipLocationChange: false } );
    }
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    this.router.navigateByUrl( `pages/account/user/${this.active}/${this.subtab}`, { skipLocationChange: false } );
  }

  loggOut(): void {
    this.auth.logout();
  }

  selectStore( store: Store ): void {
    this.selectedStore = { ...store };
    this.shopService.storeSubject( store );
    sessionStorage.setItem( 'store', JSON.stringify( store ) );
  }

  /**
   * @description Recibe el evento de perfil de tienda cuando actualiza la informacion
   * @param shop Valores de la tienda actualizada
   */
  updateShop( store: Store ): void {
    this.selectStore( store );
  }

  private openModal() {
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.RegisterStore, this.modalOption );
  }

  close( type: boolean ) {
    this.modal.dismiss();
    if ( type ) {
      this.init();
    }
  }



}
