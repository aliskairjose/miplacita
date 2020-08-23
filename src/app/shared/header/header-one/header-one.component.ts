import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component( {
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: [ './header-one.component.scss' ]
} )
export class HeaderOneComponent implements OnInit {

  @Input() class: string;
  @Input() themeLogo = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar = true; // Default True
  @Input() sticky = false; // Default false

  stick = false;
  isLoggedIn: boolean;
  role: string;
  
  // @HostListener Decorator
  @HostListener( 'window:scroll', [] )
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ( number >= 300 && window.innerWidth > 400 ) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.role = this.storage.getItem('role');
    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
      // tslint:disable-next-line: curly
      if ( !isAuth ) this.alert.info( 'Hasta luego...' );
    } );
  }

 /**
  * @description Cierra sesión
  */
  loggOut(): void {
    this.storage.clearAll();
    this.router.navigate( [ 'home/marketplace' ] );
    this.auth.authSubject( false );
  }

}
