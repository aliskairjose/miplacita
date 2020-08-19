import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

// Menu
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
}

@Injectable( {
	providedIn: 'root'
} )

export class NavService {

	screenWidth: any;
	leftMenuToggle = false;
	mainMenuToggle = false;

	
	MENUITEMS: Menu[] = [
		// { path: '/pages/login', title: 'inicia sesión', type: 'link' },
		// { path: '/home/vegetable', title: 'Vende ahora', type: 'link' },
		// { path: '/pages/contact', title: 'contactanos', type: 'link' }
	];

	LEFTMENUITEMS: Menu[] = [
		{
			path: '/pages/dashboard', title: 'Dashboard', type: 'link'
		},
		{
			path: '/pages/products', title: 'Productos', type: 'link'
		},
		{
			path: '/pages/orders', title: 'Órdenes', type: 'link'
		},
		{
			path: '/pages/shops', title: 'Tienda', type: 'link'
		},

	];

	// Array
	items = new BehaviorSubject<Menu[]>( this.MENUITEMS );
	leftMenuItems = new BehaviorSubject<Menu[]>( this.LEFTMENUITEMS );

	// Windows width
	@HostListener( 'window:resize', [ '$event' ] )
	onResize( event?) {
		this.screenWidth = window.innerWidth;
	}
	constructor() { }


}
