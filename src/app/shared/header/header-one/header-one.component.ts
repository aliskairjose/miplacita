
import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { User } from '../../classes/user';
import { SettingsComponent } from '../../components/settings/settings.component';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { ShopService } from '../../services/shop.service';
import { ActivatedRoute } from '@angular/router';

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

  @Input() store: Store = {};
  @Input() class: string;
  @Input() themeLogo = 'assets/images/marketplace/images/logo-m.png'; // Default Logo
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
    private shopService: ShopService,
    private categoryService: CategoryService,
  ) {

  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          const decod = window.atob( queryParams.config );
          const store: Store = JSON.parse( decod );
          this.shopService.customizeShop( store.config );
          this.settings.setStore( store );
          this.themeLogo = store.logo;
        }
        if ( queryParams.id ) { this.storeInfo( queryParams.id ); }
      }
    } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes.store && Object.entries( changes?.store?.currentValue ).length !== 0 ) {
      this.settings.setStore( changes.store.currentValue );
    }
  }

  ngOnInit(): void {

    this.isLoggedIn = this.auth.isAuthenticated();
    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      this.categories = [ ...response ];
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
    this.shopService.getStore( id ).subscribe( res => {
      console.log( res.result );
      this.settings.setStore( res.result );
      this.shopService.customizeShop( res.result.config );
      this.themeLogo = res.result.logo;
    } );
  }
  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.auth.logout();
  }

}
