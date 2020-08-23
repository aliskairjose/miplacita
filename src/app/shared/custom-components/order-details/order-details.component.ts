import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  public modalOpen = false;
  public closeResult: string;
  public states = ['Entregado'];
  public products = [];
  public fields = ['Producto', 'Precio','Itbms'];
  public order: any;
  public modal: any;
  @ViewChild('orderDetails', { static: false }) OrderDetails: TemplateRef<any>;

  constructor(private modalService: NgbModal) {
   }

  ngOnInit(): void {
  }

  openModal(order){
    this.modalOpen = true;
    this.order = order;
    this.products = order.products;
    this.modal = this.modalService.open(this.OrderDetails);
  }

  close(reason){
    console.log(reason);
    this.modal.close();
  }
  ngOnDestroy() {
    if (this.modalOpen){
      this.modalService.dismissAll();
    }
  }
}
