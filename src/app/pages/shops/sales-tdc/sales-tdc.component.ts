import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-tdc',
  templateUrl: './sales-tdc.component.html',
  styleUrls: ['./sales-tdc.component.scss']
})
export class SalesTdcComponent implements OnInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = ['Cliente','Tienda', 'Fecha','Banco','Transacción','Monto'];
  products = [];
  role: string;
  paginate: Paginate;
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;

  constructor(
    private auth: AuthService,
    private reportService: ReportsService,
    private exportDoc: ExportService,
    private toastr: ToastrService,
    private parseDate: CustomDateParserFormatterService

  ) { } 

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init(){
    this.loadData();
    
  }
  filtrar(): void {
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );
    const from = new Date( this.fechaIni );
    const to = new Date( this.fechaFin );

    if ( from > to ) {
      this.toastr.warning( 'La fecha inicial no debe ser menor a la final' );
      return;
    }

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
