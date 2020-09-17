import { Component, OnInit } from '@angular/core';
import { Plan } from '../../../shared/classes/plan';
import { StorageService } from '../../../shared/services/storage.service';
import { Store } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';
import { Result } from '../../../shared/classes/response';
import { User } from '../../../shared/classes/user';

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

  constructor(
    private storageService: StorageService,
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {
    const user: User = this.storageService.getItem( 'user' );
    const stores: Store[] = user.stores;

    this.shopService.getStore( stores[ 0 ]._id ).subscribe( ( response: Result<Store> ) => {
      this.plan = response.docs[ 0 ].plan;
    } );
  }

  cancelPlan() {

  }

  changePlan() {

  }
}
