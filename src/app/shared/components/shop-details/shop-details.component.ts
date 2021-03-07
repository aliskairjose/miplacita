import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../services/shop.service';
import { Store } from '../../classes/store';
import { Plan } from '../../classes/plan';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: [ './shop-details.component.scss' ]
} )
export class ShopDetailsComponent implements OnInit, OnDestroy {
  @ViewChild( 'shopDetails', { static: false } ) ShopDetails: TemplateRef<any>;

  public allBenefits = [
    [ 'Logo de la tienda',
      'Paleta de Colores',
      'Tipografía',
      'Máximo 10 productos',
      'Fotos y características del producto',
      'Pago con TDC',
      'Reporte' ],
    [ 'Logo de la tienda',
      'Paleta de Colores',
      'Tipografía',
      'Productos ilimitados',
      'Fotos y características del producto',
      'Pasarela de pago',
      'Plan de compesación',
      'Inventario',
      'Reporte' ]
  ];
  benefits = [];
  modalOpen = false;
  modal: any;
  shop: any;
  plan: Plan;
  plans: Array<Plan> = [];
  page = false;

  constructor(
    private modalService: NgbModal,
    private shopService: ShopService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.shopService.getPlans().subscribe( plans => this.plans = [ ...plans ] )
  }

  openModal( shop ) {
    this.shop = shop;
    this.getPlanInformation();
    this.modalOpen = true;
    this.modal = this.modalService.open( this.ShopDetails );
  }

  openPage() {
    this.page = true;
  }

  getPlanInformation() {
    if ( this.shop.plan.price > 0 ) {
      this.benefits = this.allBenefits[ 1 ];
    } else {
      this.benefits = this.allBenefits[ 0 ];
    }
  }

  close() {
    this.modal.close();
  }

  cancelPlan( store: Store ) {
    const _plan = this.plans.find( item => item.price === 0 );
    // tslint:disable-next-line: deprecation
    this.shopService.updateStorePlan( store._id, { plan: _plan._id } ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.close();
      }
    } )
  }

  ngOnDestroy() {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }

}
