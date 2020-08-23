import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
    this.role = this.storage.getItem('role');
    console.log(this.role)
  }

  leftMenuToggle(): void {
    this.navServices.leftMenuToggle = !this.navServices.leftMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive( item ) {
    item.active = !item.active;
  }

}
