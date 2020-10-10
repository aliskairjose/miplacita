import { Component, OnInit, Input } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: [ './left-menu.component.scss' ]
} )
export class LeftMenuComponent implements OnInit {

  menuItems: Menu[];
  menuItemsResponsive: Menu[];
  role: string;
  path = '/shop/collection/left/sidebar?name=&category=';

  constructor(
    private router: Router,
    private auth: AuthService,
    public navServices: NavService,
  ) {

    this.navServices.leftMenuItems.subscribe( menuItems => {
      this.menuItems = menuItems;
    } );

    this.navServices.leftMenuItemsResponsive.subscribe( menuItems => {
      this.menuItemsResponsive = menuItems;
    } );

    this.router.events.subscribe( ( event ) => {
      this.navServices.mainMenuToggle = false;
    } );
  }

  ngOnInit(): void {
    const user: User = this.auth.getUserActive();
    if ( user ) {
      this.role = user.role;
    }
  }

  leftMenuToggle(): void {
    this.navServices.leftMenuToggle = !this.navServices.leftMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive( item ) {
    item.active = !item.active;
  }

  routerTo( id: string ): void {
    this.router.navigateByUrl( `${this.path}${id}` );
  }

}
