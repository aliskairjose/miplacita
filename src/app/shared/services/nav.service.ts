import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { default as menu } from '../../../assets/data/menu.json';
import { CategoryService } from './category.service';
import { Category } from '../classes/category';

export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
	logged?: boolean;
	role?: string;
}

@Injectable( {
	providedIn: 'root'
} )

export class NavService {

	screenWidth: any;
	leftMenuToggle = false;
	mainMenuToggle = false;

	MENUITEMS: Menu[] = menu.menuItems;
	// LEFTMENUITEMS: Menu[] = menu.leftMenuItems;
	LEFTMENUITEMS: Menu[] = [];
	LEFTMENUITEMSRESPONSIVE: Menu[] = [
		{ path: "/pages/account/user/profile", title: "mi perfil", type: "link", logged: true, role: null },
		{ path: "/pages/account/user/orders", title: "mis pedidos", type: "link", logged: true, role: 'merchant' },
		{ path: "/pages/account/user/stores", title: "mis tiendas", type: "link", logged: true, role: 'merchant' },
		{ path: "/pages/account/user/stores", title: "tiendas", type: "link", logged: true, role: 'admin' },
		{ path: "/pages/account/user/dashboard", title: "tablero", type: "link", logged: true, role: null },
		{ path: "/pages/account/user/products", title: "productos", type: "link", logged: true, role: null },
		{ path: "/pages/account/user/admin-orders", title: "órdenes", type: "link", logged: true, role: null },
		{ path: "/pages/account/user/admin-store", title: "tienda", type: "link", logged: true, role: 'merchant' },
		{ path: "/pages/account/user/reposrt", title: "reportes", type: "link", logged: true, role: null },
	];
	sideMenuItem: Menu = {};

	// Array
	items = new BehaviorSubject<Menu[]>( this.MENUITEMS );
	leftMenuItems = new BehaviorSubject<Menu[]>( this.LEFTMENUITEMS );
	leftMenuItemsResponsive = new BehaviorSubject<Menu[]>( this.LEFTMENUITEMSRESPONSIVE );

	// Windows width
	@HostListener( 'window:resize', [ '$event' ] )
	onResize( event?) {
		this.screenWidth = window.innerWidth;
	}

	constructor(
		private categoryService: CategoryService
	) {
		this.categoryService.categoryList().subscribe( ( result: Category[] ) => {
			for ( const iterator of result ) {
				this.sideMenuItem = {};
				this.sideMenuItem.title = iterator.name;
				this.sideMenuItem.type = 'link';
				this.sideMenuItem.path = iterator._id;
				this.LEFTMENUITEMS.push( this.sideMenuItem );
			}
			
		} );


	}


}
