import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef, OnChanges } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { Paginate } from 'src/app/shared/classes/paginate';
import { environment } from 'src/environments/environment';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Store } from 'src/app/shared/classes/store';
import { OrderDetailsComponent } from 'src/app/shared/custom-components/order-details/order-details.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { ShopService } from 'src/app/shared/services/shop.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { ToastrService } from 'ngx-toastr';
import { log } from 'console';

@Component( {
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: [ './total-sales.component.scss' ]
} )
export class TotalSalesComponent implements OnInit, OnChanges {
  @ViewChild( 'orderDetails' ) OrderDetails: OrderDetailsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Fecha', 'Cantidades ordenadas', 'Total de ventas' ];
  sales: any = [];
  paginate: Paginate;
  role: string;
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private shopService: ShopService,
    private exportDoc: ExportService,
    private parseDate: CustomDateParserFormatterService
  ) {
    
  }

  ngOnInit(): void {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );
    
    this.role = this.auth.getUserRol();

    this.loadData();
  }

  private loadData( page = 1 ): void {
    const params = `store=${this.store._id}&from=${this.fechaIni}&to=${this.fechaFin}`;

    this.shopService.totalSales( params ).subscribe( result => {
      this.sales = result;
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }

    } );
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


  setPage( page: number ) {
    this.loadData( page );
  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'total-sales-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Ventas totales', 'total-sales-report' );
  }
}
