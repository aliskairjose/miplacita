import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component( {
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ]
} )
export class MenuComponent implements OnInit {

  menuItems: Menu[];
  logged: boolean;

  constructor(
    private router: Router,
    public auth: AuthService,
    public navServices: NavService,
  ) {
    this.navServices.items.subscribe( menuItems => this.menuItems = menuItems );
    this.router.events.subscribe( ( event ) => {
      this.navServices.mainMenuToggle = false;
    } );
  }

  ngOnInit(): void {
  }

  setMenu( ): void {
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive( item ) {
    item.active = !item.active;
  }

}
