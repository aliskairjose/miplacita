import { ToastrService } from 'ngx-toastr';

import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Store } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';

@Component( {
  selector: 'app-shop-suscription',
  templateUrl: './shop-suscription.component.html',
  styleUrls: [ './shop-suscription.component.scss' ]
} )
export class ShopSuscriptionComponent implements OnInit, OnChanges {
  shop: any;
  plan: any = {};
  checkIcon = 'bi bi-check2';
  uncheckIcon = 'bi bi-x';
  planPro: any;
  plans = [];
  colorFill = '#c6410f';
  basicBenefits = [
    'Catálogo limitado a 10 productos',
    'Inventario de 10 productos',
    'Chat integrado',
    'Url para redes sociales',
    'Edición de tienda',
    'Gestión de clientes'
  ];
  benefits = [
    'Control de inventario',
    'Gestión de clientes',
    'Transacciones ilimitadas',
    'Pasarela de Pago TDC',
    'Gestión de imagen de tienda',
    'Plan de compensaciones a clientes referidos',
    'Cupones de descuentos'
  ];
  enabled = true;

  @Input() store: Store;

  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
  ) {
    // tslint:disable-next-line: deprecation
    this.shopService.getPlans().subscribe( plans => this.plans = [ ...plans ] );
  }

  ngOnChanges(): void {
    // tslint:disable-next-line: deprecation
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( store ) {
        this.store = { ...store };
        this.enabled = true;
      }
    } );
    this.getShopPlan();

  }

  ngOnInit(): void {
  }

  getShopPlan(): void {
    const params = `store=${this.store._id}`;
    // tslint:disable-next-line: deprecation
    this.shopService.storeList( 1, params ).subscribe( ( response ) => this.plan = response.docs[ 0 ].plan );
  }

  changePlan( planId: string ): void {
    // tslint:disable-next-line: deprecation
    this.shopService.updateStorePlan( this.store._id, { plan: planId } ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.getShopPlan();
      }
    } );
  }
}
