import { Component, OnInit, Input } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { User } from '../../classes/user';

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
    public navServices: NavService,
    private storage: StorageService,
  ) {

    this.navServices.leftMenuItems.subscribe( menuItems => {
      this.menuItems = menuItems;
    } );

    this.navServices.leftMenuItemsResponsive.subscribe( menuItems => {
<<<<<<< HEAD
      this.menuItemsResponsive = menuItems
=======
      this.menuItemsResponsive = menuItems;
>>>>>>> ddbb8cb05930fa5a0508713df902c7bf4add47cb
    } );

    this.router.events.subscribe( ( event ) => {
      this.navServices.mainMenuToggle = false;
    } );
  }

  ngOnInit(): void {
    const user: User = this.storage.getItem( 'user' );
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
