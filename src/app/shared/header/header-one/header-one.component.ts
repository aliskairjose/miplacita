import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { User } from '../../classes/user';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: [ './header-one.component.scss' ]
} )
export class HeaderOneComponent implements OnInit {
  stick = false;
  isLoggedIn: boolean;
  role: string;
  user: User;
  categories: Category[] = [];
  
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
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private toastrService: ToastrService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      this.categories = [ ...response ];
    } );

    if ( this.isLoggedIn ) {
      this.user = this.storage.getItem( 'user' );
      this.role = this.user.role;
    }

    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
      if ( isAuth ) {
        this.user = this.storage.getItem( 'user' );
        this.role = this.user.role;
      }
      // tslint:disable-next-line: curly
      if ( !isAuth ) this.toastrService.info( 'Hasta luego...' );
    } );
  }

  /**
   * @description Cierra sesión
   */
  loggOut(): void {
    this.storage.clearAll();
    this.router.navigate( [ 'home' ] );
    this.auth.authSubject( false );
  }


}
