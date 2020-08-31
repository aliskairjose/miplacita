import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shop-submenu',
  templateUrl: './shop-submenu.component.html',
  styleUrls: ['./shop-submenu.component.scss']
})
export class ShopSubmenuComponent implements OnInit {
  @Input() active: number;
  menuItems = [
    { id: 0, path: '/pages/shop/profile', title: 'Perfil', type: 'link', role: 'merchant' },
    { id: 1, path: '/pages/shop/design', title: 'Diseño', type: 'link', role: 'merchant' },
    { id: 2, path: '/pages/shop/suscription', title: 'Suscripción', type: 'link', role: 'merchant' },
    { id: 3, path: '/pages/shop/withdrawal', title: 'Retiro', type: 'link', role: 'merchant' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
