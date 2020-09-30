import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Product } from 'src/app/shared/classes/product';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss']
})
export class BestSellersComponent implements OnInit {
  

  fields = ['ID del Producto', 'Nombre del Producto','Cantidad'];
  bestSellers: Product[]= []
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
