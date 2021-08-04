import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopService } from '../../../shared/services/shop.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterStoreComponent } from '../../../shared/components/register-store/register-store.component';
import { STANDARD_IMAGE } from '../../../shared/classes/global-constants';
import { StorageService } from '../../../shared/services/storage.service';

@Component( {
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: [ './account-manage.component.scss' ]
} )

export class AccountManageComponent implements OnInit, OnChanges {
  @ViewChild( 'registerNewStore' ) RegisterStore: RegisterStoreComponent;
  @ViewChild( 'content', { read: TemplateRef } ) content: TemplateRef<any>;

  standardImage = STANDARD_IMAGE;
  stores: Store[] = [];
  active = 'profile';
  user: User = {};
  subtab = 'store-profile';
  selectedStore: Store = {};
  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {}; // not null!
  step = 0;
  hasShipments: any;
  isConfigured: boolean;

  clientOptions = [
    { name: 'Mi Perfil', id: 'user-icon', key: 'profile', icon: 'assets/images/marketplace/images/icons/profile.png' },
    { name: 'Mis Órdenes', key: 'orders', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Mis Tiendas', key: 'stores', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Ayuda', id: 'big-icon', key: 'support', icon: 'assets/images/marketplace/images/icons/help.png' },

  ];
  adminStoreOptions = [
    { name: 'Visitar Tienda', key: 'view-store', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Mi Perfil', id: 'user-icon', key: 'profile', icon: 'assets/images/marketplace/images/icons/profile.png' },
    { name: 'Tablero', key: 'dashboard', icon: 'assets/images/marketplace/images/icons/tablero.png' },
    { name: 'Productos', key: 'products', icon: 'assets/images/marketplace/images/icons/productos.png' },
    { name: 'Órdenes', key: 'admin-orders', icon: 'assets/images/marketplace/images/icons/orders.png' },
    { name: 'Perfil de tienda', key: 'admin-store', icon: 'assets/images/marketplace/images/icons/store.png' },
    { name: 'Mis Tiendas', key: 'stores', icon: 'assets/images/marketplace/images/icons/store.png' },
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
    private modalService: NgbModal,
    private storage: StorageService,
    private shopService: ShopService,
  ) {
    this.user = this.auth.getUserActive();
  }


  ngOnChanges( changes: SimpleChanges ): void {
    this.init();
  }

  ngOnInit(): void {

    if ( localStorage.getItem( 'mp-store-shop' ) ) {
      const store: Store = this.storage.getItem( 'mp-store-shop' );
      if ( store.config ) { this.shopService.customizeShop( store.config ); }
    }
    this.init();
  }

  init( newStore = false ): void {
    console.log( 'init' );

    let provisionalSubtab = '';

    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      if ( this.active === 'admin-store' && url.length > 3 ) {
        provisionalSubtab = url[ 3 ].path;
      } else if ( this.active === 'admin-store' && url.length === 3 ) {
        provisionalSubtab = 'store-profile';
      }
      if ( this.active === 'profile' && url.length > 3 ) {
        this.active = 'profile';
      }
    } );

    // Se cargas las tiendas solo de merchant
    if ( this.user.role === 'merchant' ) {

      this.shopService.getMyStores( this.user._id ).subscribe( stores => {
        if ( stores.docs.length ) {
          const _store = JSON.parse( sessionStorage.getItem( 'store' ) );
          this.stores = [ ...stores.docs ];
          this.stores.push( { new_store: true } );
          this.subtab = provisionalSubtab;

          // Me indica si hay nueva tienda y la selecciona
          if ( newStore ) {
            const lastStore = this.stores[ this.stores.length - 2 ];
            this.selectStore( lastStore, true );
          } else {
            if ( _store ) {
              this.selectedStore = _store;
            } else {
              this.selectedStore = this.stores[ 0 ];
              sessionStorage.setItem( 'store', JSON.stringify( this.stores[ 0 ] ) );
            }
          }
          this.shopService.storeSubject( this.selectedStore );
        }

      } );
    }
  }

  createStore(): void {
    this.step = 1;
    this.openModal();
  }

  updateTab( tab: string ) {
    this.active = tab;
    let route = tab;

    if ( tab === 'reports' && this.user.role === 'merchant' ) {
      route = `reports/daily-sales`;
    }

    if ( this.active === 'reports' && this.user.role === 'admin' ) {
      route = `reports/sales-mp`;
    }

    if ( tab === 'admin-store' ) {
      route = `${tab}/store-profile`;
    }

    this.router.navigateByUrl( `pages/account/user/${route}`, { skipLocationChange: false } );
  }

  updateSubtab( tab: string ): void {
    this.subtab = tab;
    this.closeModal();
    this.router.navigateByUrl( `pages/account/user/admin-store/${tab}`, { skipLocationChange: false } );
  }

  loggOut(): void {
    this.auth.logout();
  }

  async selectStore( store: Store, isNew = false ) {
    this.selectedStore = { ...store };

    if ( isNew ) {
      this.router.navigateByUrl( 'pages/account/user/admin-store/design', { skipLocationChange: false } );
    } else {
      this.hasShipments = await this.loadZones( this.selectedStore._id );
      this.isConfigured = !store.config.color || !store.config.font || !store.config.images.length;
      if ( this.isConfigured || !this.hasShipments ) { this.openConfigModal(); }
    }

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

  closeModal(): void {
    this.modal.dismiss();
  }

  private openModal() {
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.RegisterStore, this.modalOption );
  }

  private openConfigModal(): void {
    this.modal = this.modalService.open( this.content );
  }

  close( type: boolean ) {
    this.modal.dismiss();
    if ( type ) {
      this.init( true );
    }
  }

  private loadZones( id: string ) {
    return new Promise( resolve => {
      this.shopService
        .findShipmentOptionByShop( id )
        .subscribe( shipments => {
          const res = shipments.length > 0 ? true : false;
          resolve( res );
        } );
    } );
  }

}
