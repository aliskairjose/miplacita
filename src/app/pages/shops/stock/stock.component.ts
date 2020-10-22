import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { Paginate } from 'src/app/shared/classes/paginate';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
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
    this.reportService.stockMP().subscribe((result)=>{
      console.log(result,"inventario de MP");
    })
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
