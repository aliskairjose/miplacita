import { Component, OnInit } from '@angular/core';
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
export class ShopSuscriptionComponent implements OnInit {
  shop: any;
  plan: any = {};
  checkIcon = 'bi bi-check2';
  uncheckIcon = 'bi bi-x';
  planPro: any;
  plans = [];
  private _stores: Store[] = [];

  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    const user: User = this.storageService.getItem( 'user' );
    this._stores = [ ...user.stores ];

    this.shopService.getStore( this._stores[ 0 ]._id ).subscribe( ( response: Result<Store> ) => {
      this.plan = response.docs[ 0 ].plan;
    } );

    this.shopService.getPlans().subscribe( plans => {
      this.plans = [ ...plans ];
    } );
  }

  cancelPlan(): void {

  }

  changePlan( planId: string ): void {
    this.shopService.updateStorePlan( this._stores[ 0 ]._id, { plan: planId } ).subscribe( result => {
      if ( result.success ) {
        this.toastrService.info( result.message[ 0 ] );
      }
    } );
  }
}
