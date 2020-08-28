import { Component, OnInit } from '@angular/core';
import { Plan } from '../../shared/classes/plan';
import { StorageService } from '../../shared/services/storage.service';
import { Store } from '../../shared/classes/store';
import { StoreService } from '../../shared/services/store.service';
import { Result } from '../../shared/classes/response';

@Component( {
  selector: 'app-shop-suscription',
  templateUrl: './shop-suscription.component.html',
  styleUrls: [ './shop-suscription.component.scss' ]
} )
export class ShopSuscriptionComponent implements OnInit {
  shop: any;
  plan: Plan;

  constructor(
    private storage: StorageService,
    private storeService: StoreService,
  ) { }

  ngOnInit(): void {
    const stores: Store[] = this.storage.getItem( 'stores' );
    this.storeService.getStore( stores[ 0 ]._id ).subscribe( ( response: Result<Store[]> ) => {
      this.plan = response.docs[0].plan;
    } );
  }

  cancelPlan() {

  }

  changePlan() {

  }
}
