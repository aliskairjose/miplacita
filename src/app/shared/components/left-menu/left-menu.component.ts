import { Component, OnInit } from '@angular/core';
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
  role: string;

  constructor(
    private router: Router,
    public navServices: NavService,
    private storage: StorageService,
  ) {
    this.navServices.leftMenuItems.subscribe( menuItems => this.menuItems = menuItems );
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

}
