import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { Order } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';


@Component( {
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: [ './order-details.component.scss' ]
} )
export class OrderDetailsComponent implements OnInit, OnDestroy {

  modalOpen = false;
  closeResult: string;
  states = environment.orderStatus;
  products = [];
  fields = [ 'Producto', 'Precio', 'Itbms' ];
  order: Order;
  detail: Order;
  modal: any;

  @ViewChild( 'orderDetails', { static: false } ) OrderDetails: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  updateStatus(): void {
    this.orderService.updateStatus( { status: this.detail.status }, this.detail._id ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
        this.close();
      }
    } );
  }

  openModal( order: Order ) {
    this.detail = { ...order };
    this.modalOpen = true;
    this.order = { ...order };
    this.products = this.detail.items;
    this.modal = this.modalService.open( this.OrderDetails );
  }

  close() {
    this.order.status = this.detail.status;
    this.modal.close();
  }

  ngOnDestroy() {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }
}
