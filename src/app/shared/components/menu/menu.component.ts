import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ]
} )
export class MenuComponent implements OnInit {

  menuItems: Menu[];

  constructor(
    private router: Router,
    private auth: AuthService,
    public navServices: NavService,
  ) {
    this.navServices.items.subscribe( menuItems => this.menuItems = menuItems );
    this.router.events.subscribe( ( event ) => {
      this.navServices.mainMenuToggle = false;
    } );
  }

  ngOnInit(): void {
    this.auth.authObserver().subscribe( ( isAuth: boolean ) => {
      if ( isAuth ) {
        this.setMenu();
      }
    } );

    // tslint:disable-next-line: curly
    this.setMenu();
  }

  setMenu(): void {
    if ( this.auth.isAuthenticated() ) {
      this.menuItems = [
        { path: '/home/vegetable', title: 'Vende ahora', type: 'link' },
        { path: '/pages/contact', title: 'contactanos', type: 'link' }
      ];
    } else {
      this.menuItems = [
        { path: '/pages/login', title: 'inicia sesión', type: 'link' },
        { path: '/home/vegetable', title: 'Vende ahora', type: 'link' },
        { path: '/pages/contact', title: 'contactanos', type: 'link' }
      ];
    }
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive( item ) {
    item.active = !item.active;
  }

}
