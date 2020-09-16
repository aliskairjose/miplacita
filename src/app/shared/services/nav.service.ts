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
	sideMenuItem: Menu = {};

	// Array
	items = new BehaviorSubject<Menu[]>( this.MENUITEMS );
	leftMenuItems = new BehaviorSubject<Menu[]>( this.LEFTMENUITEMS );

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
