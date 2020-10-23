import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';

@Component( {
  selector: 'app-percentage-mp-products',
  templateUrl: './percentage-mp-products.component.html',
  styleUrls: [ './percentage-mp-products.component.scss' ]
} )
export class PercentageMpProductsComponent implements OnInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Tienda', 'Dueño', 'Código de producto', 'Nombre del producto', 'Cantidad en existencia' ];
  products = [];
  role: string;
  paginate: Paginate;

  constructor(
    private auth: AuthService,
    private reportService: ReportsService,
    private exportDoc: ExportService,
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.loadData();

  }

  loadData( page = 1 ) {
    this.reportService.percentageMpSales().subscribe( ( result ) => {
      console.log( result, 'porcentaje de ventas en MP y venta en tienda' );
    } );
  }
  setPage( page: number ) {
    this.loadData( page );
  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'stock-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Inventario', 'stock-report' );
  }

}
