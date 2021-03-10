
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

  @Input() store: Store = {};
  @Input() isStoreSearch = false;
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
    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          const decod = window.atob( queryParams.config );
          this.store = JSON.parse( decod );
          if ( Object.entries( this.store ).length !== 0 ) {
            this.isStoreSearch = true;
            this.shopService.customizeShop( this.store.config );
            this.settings.setStore( this.store );
            this.themeLogo = this.store.logo;
            this.link = `/${this.store.url_store}`;
          }

        }
        if ( queryParams.id ) {
          this.isStoreSearch = true;
          this.storeInfo( queryParams.id );
        }
      }
    } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes.store && Object.entries( changes?.store?.currentValue ).length !== 0 ) {
      this.link = `/${changes.store.currentValue.url_store}`;
      this.settings.setStore( changes.store.currentValue );
    }

    if ( sessionStorage.sessionStore ) {
      const store: Store = JSON.parse( sessionStorage.sessionStore );
      this.storeInfo( store._id );
    }
  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.shopService.storeObserver().subscribe( store => {
      if ( !store ) {
        this.themeLogo = 'assets/images/marketplace/svg/logo.svg';
        this.link = '/home';
      }
    } );
    this.isLoggedIn = this.auth.isAuthenticated();
    // tslint:disable-next-line: deprecation
    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      this.categories = [ ...response ];
    } );

    if ( this.isLoggedIn ) {
      this.user = this.auth.getUserActive();
      this.role = this.user.role;
    }
    // tslint:disable-next-line: deprecation
    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
      if ( isAuth ) {
        this.user = this.auth.getUserActive();
        this.role = this.user.role;
      }
    } );
  }

  private storeInfo( id: string ) {
    // tslint:disable-next-line: deprecation
    this.shopService.getStore( id ).subscribe( res => {
      this.settings.setStore( res.result );
      this.shopService.customizeShop( res.result.config );
      this.themeLogo = res.result.logo;
      this.link = `/${res.result.url_store}`;
    } );
  }

  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.auth.logout();
  }

}
