import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';

@Component({
  selector: 'app-sales-tdc',
  templateUrl: './sales-tdc.component.html',
  styleUrls: ['./sales-tdc.component.scss']
})
export class SalesTdcComponent implements OnInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = ['Tienda','Dueño', 'Código de producto','Nombre del producto','Cantidad en existencia']
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

  init(){
    this.loadData();
    
  }

  loadData(page = 1){
    this.reportService.tdcSales().subscribe((result)=>{
      console.log(result,"ventas con tdc");
    })
  }
  setPage( page: number ) {
    this.loadData( page );
  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'tdc-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Ventas con TDC', 'tdc-report' );
  }


}
