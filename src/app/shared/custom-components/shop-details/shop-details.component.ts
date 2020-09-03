import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('shopDetails', { static: false }) ShopDetails: TemplateRef<any>;
  public allBenefits = [
    ['Logo de la tienda',
      'Paleta de Colores',
      'Tipografía',
      'Máximo 10 productos',
      'Fotos y características del producto',
      'Pago con TDC',
      'Reporte'],
    ['Logo de la tienda',
      'Paleta de Colores',
      'Tipografía',
      'Productos ilimitados',
      'Fotos y características del producto',
      'Pasarela de pago',
      'Plan de compesación',
      'Inventario',
      'Reporte']
  ];
  public benefits = [];
  public modalOpen = false;
  public modal: any;
  public shop: any;
  public plan: any;
  public page = false;

  constructor(
    private modalService: NgbModal,
    private ShopService: ShopService) { }

  ngOnInit(): void {
  }

  openModal(shop) {
    console.log(shop);
    this.shop = shop;
    this.getPlanInformation();
    this.modalOpen = true;
    this.modal = this.modalService.open(this.ShopDetails);
  }

  openPage(){
    this.page = true;
  }

  getPlanInformation(){
    // informacion de plan de la tienda
    // this.ShopService.getPlans().subscribe( ( plans: any ) => {
    //   this.plan = plans.filter(plan => plan.id === this.shop.plan.id );
    //   console.log(this.plan);

    // } );
    if (this.shop.plan.price > 0) {
      this.benefits = this.allBenefits[1];
    } else {
      this.benefits = this.allBenefits[0];
    }
  }

  close(reason){
    this.modal.close();
  }

  cancelPlan(){
    // api para cancelar plan
  }

  ngOnDestroy() {
    if (this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
