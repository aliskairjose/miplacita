import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { Paginate } from 'src/app/shared/classes/paginate';
import { environment } from 'src/environments/environment';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Store } from 'src/app/shared/classes/store';
import { OrderDetailsComponent } from 'src/app/shared/custom-components/order-details/order-details.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.scss']
})
export class TotalSalesComponent implements OnInit {
  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;

  fields = ['Número de orden', 'Monto','Cliente','Estado', ''];
  sales = []
  paginate: Paginate;
  role: string;
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  @Input() store: Store;
  constructor(private auth: AuthService,
              private ngbCalendar: NgbCalendar) { }

  ngOnInit(): void {
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.role = this.auth.getUserRol();

    this.loadData();
  }
  
  private loadData( page = 1 ): void {
    //conexion con api
  }


  setPage( page: number ) {
    this.loadData( page );
  }

}
