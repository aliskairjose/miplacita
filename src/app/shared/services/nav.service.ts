import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { default as menu } from '../../../assets/data/menu.json';

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
	LEFTMENUITEMS: Menu[] = menu.leftMenuItems;

	// Array
	items = new BehaviorSubject<Menu[]>( this.MENUITEMS );
	leftMenuItems = new BehaviorSubject<Menu[]>( this.LEFTMENUITEMS );

	// Windows width
	@HostListener( 'window:resize', [ '$event' ] )
	onResize( event?) {
		this.screenWidth = window.innerWidth;
	}

	constructor() {
		console.log(menu)
	 }

}
