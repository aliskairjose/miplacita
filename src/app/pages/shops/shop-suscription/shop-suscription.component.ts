import { ToastrService } from 'ngx-toastr';

import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { Store } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';
import { BASIC_BENEFITS, BENEFITS } from '../../../shared/classes/global-constants';
import { Plan } from '../../../shared/classes/plan';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from '../../../shared/components/payment/payment.component';

@Component( {
  selector: 'app-shop-suscription',
  templateUrl: './shop-suscription.component.html',
  styleUrls: [ './shop-suscription.component.scss' ]
} )
export class ShopSuscriptionComponent implements OnInit, OnChanges {
  shop: any;
  plan: Plan = {};
  checkIcon = 'bi bi-check2';
  uncheckIcon = 'bi bi-x';
  planPro: any;
  plans: Array<Plan> = [];
  colorFill = '#c6410f';
  basicBenefits = BASIC_BENEFITS;
  benefits = BENEFITS;
  enabled = true;
  selectedPlan: Plan = {};

  private _modal: any;
  private _modalOption: NgbModalOptions = {}; // not null!

  @Input() store: Store;

  @ViewChild( 'payment' ) payment: PaymentComponent;

  constructor(
    private modalService: NgbModal,
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

  changePlan( plan: Plan, content?: any ): void {
    this.selectedPlan = { ...plan };
    ( content ) ? this.openModal( content ) : this.updatePlan( {} );
  }

  payPlan( data ): void {
    const _tdc: any = {};
    if ( data?.valid ) {
      _tdc.card_number = data.tdc.card_number;
      _tdc.owner_card = data.tdc.owner;
      _tdc.cvv_card = data.tdc.cvv;
      _tdc.date_card = data.tdc.date;
      this._modal.close();
      this.updatePlan( _tdc );
    }
  }

  private openModal( content ) {
    this._modalOption.backdrop = 'static';
    this._modalOption.keyboard = false;
    this._modal = this.modalService.open( content, this._modalOption );
  }

  private updatePlan( tdc: any ): void {
    const _data = { ...tdc, plan: this.selectedPlan._id };
    // _data.plan = this.selectedPlan._id;

    // tslint:disable-next-line: deprecation
    this.shopService.updateStorePlan( this.store._id, _data ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.getShopPlan();
      }
    } );
  }
}
