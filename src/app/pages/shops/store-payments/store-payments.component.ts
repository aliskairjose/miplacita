import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store-payments',
  templateUrl: './store-payments.component.html',
  styleUrls: ['./store-payments.component.scss']
})
export class StorePaymentsComponent implements OnInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = ['Tienda','Fecha de pago','Monto a pagar','Comisiones MP', ''];
  stores = [];
  role: string;
  paginate: Paginate;
  fechaIni = '';
  fechaFin = '';
  modelFrom: NgbDateStruct;
  searchText = '';

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

  loadData(page = 1){
    // this.reportService.storesPayment().subscribe((result)=>{
    //   console.log(result,"pagos de tiendas");
    // })
  }
  filtrar(): void {
    this.fechaIni = this.parseDate.format( this.modelFrom );
    const from = new Date( this.fechaIni );
    const to = new Date( this.fechaFin );

    if ( from > to ) {
      this.toastr.warning( 'La fecha inicial no debe ser menor a la final' );
      return;
    }

    this.loadData();
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
