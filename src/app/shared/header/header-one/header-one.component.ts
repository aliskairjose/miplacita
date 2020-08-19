import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'ngx-alerts';

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
    private auth: AuthService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      this.isLoggedIn = isAuth;
      // tslint:disable-next-line: curly
      if ( !isAuth ) this.alert.info( 'Hasta luego...' );
    } );
  }

}
