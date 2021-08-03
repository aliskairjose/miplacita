
import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { User } from '../../classes/user';
import { SettingsComponent } from '../../components/settings/settings.component';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { ShopService } from '../../services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component( {
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: [ './header-one.component.scss' ]
} )

export class HeaderOneComponent implements OnInit, OnChanges, AfterViewInit {
  stick = false;
  isLoggedIn: boolean;
  role: string;
  user: User;
  categories: Category[] = [];
  link = '/home';

  @Input() mode: null;
  @Input() store: Store = {};
  @Input() isStoreSearch: boolean;
  @Input() class: string;
  @Input() themeLogo = 'assets/images/marketplace/svg/logo.svg'; // Default Logo
  @Input() isHidde = true;
  @Input() topbar = true; // Default True
  @Input() sticky = false; // Default false
  @Input() hasSearchBar = false; // Default false
  @Input() isSideMenu = false;

  @ViewChild( 'settings' ) settings: SettingsComponent;

  // @HostListener Decorator
  @HostListener( 'window:scroll', [] )
  onWindowScroll() {
    // tslint:disable-next-line: variable-name
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ( number >= 300 && window.innerWidth > 400 ) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private shopService: ShopService,
    private storageService: StorageService,
    private categoryService: CategoryService,
  ) {
  }

  ngAfterViewInit(): void {
    if ( localStorage.getItem( 'mp-store-shop' ) ) {
      this.store = this.storage.getItem( 'mp-store-shop' );
      this.shopService.customizeShop( this.store.config );
      this.settings.setStore( this.store );
      this.themeLogo = this.store.logo;
      this.link = `/${this.store.url_store}`;
    }

    if ( this.storage.getItem( 'isStore' ) ) {
      this.store = this.storage.getItem( 'isStore' );
      this.isStoreSearch = true;
      this.shopService.customizeShop( this.store.config );
      this.settings.setStore( this.store );
      this.themeLogo = this.store.logo;
      this.link = `/${this.store.url_store}`;
    }
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes.store && Object.entries( changes?.store?.currentValue ).length !== 0 ) {
      this.link = `/${changes.store.currentValue.url_store}`;
      this.settings.setStore( changes.store.currentValue );
    }

    if ( this.storage.getItem( 'isStore' ) ) {
      const store: Store = this.storage.getItem( 'isStore' );
      this.storeInfo( store._id );
    }
  }

  ngOnInit(): void {

    this.shopService.storeObserver().subscribe( store => {
      if ( !store ) {
        this.themeLogo = 'assets/images/marketplace/svg/logo.svg';
        this.link = '/home';
      }
    } );
    this.isLoggedIn = this.auth.isAuthenticated();

    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      const alls = [ {
        _id: '',
        description: 'Todas las categorías',
        name: 'Todas las categorías'
      } ];
      this.categories = [ ...alls, ...response ];
    } );

    if ( this.isLoggedIn ) {
      this.user = this.auth.getUserActive();
      this.role = this.user.role;
    }

    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
      if ( isAuth ) {
        this.user = this.auth.getUserActive();
        this.role = this.user.role;
      }
    } );
  }

  private storeInfo( id: string ) {

    this.shopService.getStore( id ).subscribe( ( store: Store ) => {
      this.settings.setStore( store );
      this.shopService.customizeShop( store.config );
      this.themeLogo = store.logo;
      this.link = `/${store.url_store}`;
      this.shopService.storeSubject( store );
    } );
  }

  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.auth.logout();
  }

}
