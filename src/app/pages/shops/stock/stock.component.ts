import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Paginate } from 'src/app/shared/classes/paginate';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../../../shared/classes/filter';

@Component( {
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: [ './stock.component.scss' ]
} )
export class StockComponent implements OnInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Tienda', 'Dueño', 'Nombre del producto', 'Cantidad en existencia' ]
  products = [];
  role: string;
  paginate: Paginate;
  modelFrom: NgbDateStruct;
  filter: Filter = {};

  constructor(
    private auth: AuthService,
    private reportService: ReportsService,
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.loadData();
  }

  loadData() {
    this.reportService.stockMP().subscribe( ( products ) => {
      this.products = [ ...products ];
    } );
  }

  filtrar( filter: Filter ) {
    this.filter = filter;
    this.loadData();
  }

}
