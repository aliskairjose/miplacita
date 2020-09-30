import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { Order } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';


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
  role: string;
  @ViewChild( 'orderDetails', { static: false } ) OrderDetails: TemplateRef<any>;

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();

  }

  updateStatus(): void {
    this.orderService.updateStatus( { status: this.order.status }, this.order._id ).subscribe( response => {
      if ( response.success ) {
        this.detail.status = this.order.status;
        this.toastrService.info( response.message[ 0 ] );
        this.close();
      }
    } );
  }

  openModal( order: Order ) {
    this.modalOpen = true;
    this.detail = order;
    this.order = { ...order };
    this.products = this.order.items;
    this.modal = this.modalService.open( this.OrderDetails );
  }

  close() {
    this.modal.close();
  }

  ngOnDestroy() {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }
}
