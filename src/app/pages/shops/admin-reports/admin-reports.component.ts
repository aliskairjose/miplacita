import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component( {
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: [ './admin-reports.component.scss' ]
} )
export class AdminReportsComponent implements OnInit {

  active = 'reports';
  subtab = 'daily-sales';
  tabs = [
    [
      { name: '20% VS el % de la tienda', active: 'sales-mp' },
      { name: 'Ventas con TDC', active: 'tdc' },
      { name: 'Productos más vendidos', active: 'best-sellers' },
      { name: 'Tiendas activas con membresía', active: 'store-membership' },
      { name: 'Ventas diarias por producto', active: 'daily-sales' }
    ],
    [
      { name: 'Clientes Marketplace', active: 'clients' },
      { name: 'Ordenes Marketplace', active: 'orders-mp' },
      { name: 'Pago de tiendas', active: 'store-payment' },
      { name: 'Inventario Marketplace', active: 'inventory-mp' },
    ]
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      this.subtab = url[ 3 ].path;
    } );
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    this.router.navigateByUrl( `pages/account/user/${this.active}/${this.subtab}`, { skipLocationChange: false } );
  }

  init() {

  }
}
