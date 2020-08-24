import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  @ViewChild('shopDetails', { static: false }) ShopDetails: TemplateRef<any>;
  public benefits = ['10 productos máximos', 'Tienda propia', 'Catálogo virtual'];
  public modalOpen = false;
  public modal: any;
  public shop: any;
  public plan: any;
  public page = false;

  constructor(private modalService: NgbModal) { 
    console.log("construtor");
  }

  ngOnInit(): void {
    console.log("ngOnInit");
  }

  openModal(shop) {
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
    this.plan = { name: 'plan #1'};
  }

  close(reason){
    this.modal.close();
  }

  cancelPlan(){
    // api para cancelar plan
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
