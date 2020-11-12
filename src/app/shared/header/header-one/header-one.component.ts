
import {
  Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';

import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { User } from '../../classes/user';
import { SettingsComponent } from '../../components/settings/settings.component';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component( {
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: [ './header-one.component.scss' ]
} )

export class HeaderOneComponent implements OnInit, OnChanges {
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
    private categoryService: CategoryService
  ) {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes?.store?.currentValue ) {
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

  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.auth.logout();
  }

}
