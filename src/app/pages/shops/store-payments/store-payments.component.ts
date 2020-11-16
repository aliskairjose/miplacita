// export class StorePaymentsComponent implements OnInit {
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { Store } from '../../../shared/classes/store';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';
import { Filter } from '../../../shared/classes/filter';
@Component( {
  selector: 'app-store-payments',
  templateUrl: './store-payments.component.html',
  styleUrls: [ './store-payments.component.scss' ]
} )


export class StorePaymentsComponent implements OnInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Tienda', 'Fecha de pago', 'Monto a pagar', '' ];
  data: any = {};
  role: string;
  stores: Store[] = [];
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  noData: boolean;
  filter: Filter = {};

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private exportDoc: ExportService,
    private reportService: ReportsService,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filter.fechaIni = this.filter.fechaFin = this.parseDate.format( this.modelFrom );
    this.filter.storeId = '';
    this.loadData();
  }

  filtrar( filter: Filter ): void {
    this.filter = filter;
    this.loadData();
  }


  private loadData() {
    const params = `from=${this.filter.fechaIni}&to=${this.filter.fechaFin}&store=${this.filter.storeId}`;
    this.reportService.percentageMpSales( params ).subscribe( response => {
      this.data = { ...response };
      this.noData = response.result.length;
    } );
  }

}
