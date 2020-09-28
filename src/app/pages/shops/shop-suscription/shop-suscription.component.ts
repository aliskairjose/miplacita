import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Plan } from '../../../shared/classes/plan';
import { StorageService } from '../../../shared/services/storage.service';
import { Store } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';
import { Result } from '../../../shared/classes/response';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';

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
    'Transaciones ilimitadas',
    'Pasarela de Pago TDC',
    'Gestión de imagen de tienda',
    'Plan de compensaciones a clientes referidos',
    'Cupones de descuentos'
  ];
  enabled = false;
  private _stores: Store[] = [];

  @Input() store: Store;

  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
    private storageService: StorageService,
  ) { }

  ngOnChanges( changes: SimpleChanges ): void {
    this.getShopPlan();
  }

  ngOnInit(): void {
    const user: User = this.storageService.getItem( 'user' );
    this._stores = [ ...user.stores ];

    if ( this.store ) {
      this.enabled = true;
      this.getShopPlan();
    }

    this.shopService.getPlans().subscribe( plans => {
      this.plans = [ ...plans ];
    } );
  }

  getShopPlan(): void {
    const params = `store=${this.store._id}`;
    this.shopService.storeList( 1, params ).subscribe( ( response ) => {
      console.log(response.docs);
      
      this.plan = response.docs[ 0 ].plan;
    } );
  }

  cancelPlan(): void {

  }

  changePlan( planId: string ): void {
    this.shopService.updateStorePlan( this._stores[ 0 ]._id, { plan: planId } ).subscribe( response => {
      const plan = response.result.plan;
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.getShopPlan();
      }
    } );
  }
}
