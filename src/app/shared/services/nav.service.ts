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
		{
			title: 'mi perfil', type: 'sub', logged: true, role: 'client',
			children: [
				{ path: '/pages/account/user/profile', title: 'Datos de la cuenta', type: 'link', logged: true, role: 'client' },
				{ path: '/pages/account/user/profile/address', title: 'Dirección', type: 'link', logged: true, role: 'client' },
			]
		},
		{ path: '/pages/account/user/orders', title: 'mis pedidos', type: 'link', logged: true, role: 'client' },
		{ path: '/pages/account/user/stores', title: 'mis tiendas', type: 'link', logged: true, role: 'client' },
		// { path: '/pages/account/user/card', title: 'tarjetas', type: 'link', logged: true, role: 'client' },
		{ path: '/pages/account/user/support', title: 'ayuda', type: 'link', logged: true, role: 'client' },

		{ path: '/pages/account/user/profile', title: 'mi perfil', type: 'link', logged: true, role: 'merchant' },
		{ path: '/pages/account/user/dashboard', title: 'tablero', type: 'link', logged: true, role: 'merchant' },
		{ path: '/pages/account/user/products', title: 'productos', type: 'link', logged: true, role: 'merchant' },
		{ path: '/pages/account/user/admin-orders', title: 'órdenes', type: 'link', logged: true, role: 'merchant' },
		{ path: '/pages/account/user/stores', title: 'mis tiendas', type: 'link', logged: true, role: 'merchant' },
		{
			title: 'tienda', type: 'sub', logged: true, role: 'merchant',
			children: [
				{ path: '/pages/account/user/admin-store', title: 'Perfil de tienda', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/admin-store/design', title: 'Diseño de tienda', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/admin-store/suscription', title: 'Suscripción', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/admin-store/withdrawal', title: 'Retiro', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/admin-store/shipping', title: 'Configuración de zonas', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/admin-store/create-referrals', title: 'Referidos', type: 'link', logged: true, role: 'merchant' },
			]
		},
		// { path: '/pages/account/user/card', title: 'tarjetas', type: 'link', logged: true, role: 'merchant' },
		{
			title: 'reportes', type: 'sub', logged: true, role: 'merchant',
			children: [
				{ path: '/pages/account/user/reports/daily-sales', title: 'ventas diarias', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/reports/clients', title: 'clientes', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/reports/best-sellers', title: 'best-sellers', type: 'link', logged: true, role: 'merchant' },
				{ path: '/pages/account/user/reports/total-sales', title: 'total-sales', type: 'link', logged: true, role: 'merchant' },

			]
		},
		{ path: '/pages/account/user/support', title: 'ayuda', type: 'link', logged: true, role: 'merchant' },
		{ path: '/pages/account/user/profile', title: 'mi perfil', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/dashboard', title: 'tablero', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/products', title: 'productos', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/admin-orders', title: 'órdenes', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/stores', title: 'tiendas', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/commissions', title: 'comisiones', type: 'link', logged: true, role: 'admin' },
		{ path: '/pages/account/user/plans', title: 'Planes', type: 'link', logged: true, role: 'admin' },
		{
			title: 'reportes', type: 'sub', logged: true, role: 'admin',
			children: [
				{ path: '/pages/account/user/reports/sales-mp', title: '20% VS el % de la tienda ', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/tdc', title: 'Ventas con TDC ', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/best-sellers', title: 'productos más vendidos ', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/store-membership', title: ' tiendas activas con membresía ', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/daily-sales', title: 'ventas diarias por producto ', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/clients', title: 'clientes marketplace', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/orders-mp', title: 'órdenes marketplace', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/store-payment', title: 'pago de tiendas', type: 'link', logged: true, role: 'admin' },
				{ path: '/pages/account/user/reports/inventory-mp', title: 'inventario marketplace', type: 'link', logged: true, role: 'admin' },
			]
		},
		{ path: '/pages/account/user/terms', title: 'Términos y condiciones', type: 'link', logged: true, role: 'admin' },
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
