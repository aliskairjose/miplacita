import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Product } from 'src/app/shared/classes/product';
import { ExportService } from 'src/app/shared/services/export.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../../../shared/services/reports.service';

@Component( {
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: [ './best-sellers.component.scss' ]
} )
export class BestSellersComponent implements OnInit, OnChanges {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;


  fields = [ 'ID del Producto', 'Nombre del Producto', 'Cantidad Vendida' ];
  bestSellers: Product[] = [];
  paginate: Paginate;
  role: string;
  order = 'desc';
  fechaIni = '';
  fechaFin = '';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private reports: ReportsService,
    private ngbCalendar: NgbCalendar,
    private exportDoc: ExportService,
    private parseDate: CustomDateParserFormatterService
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();

  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.fechaFin = this.parseDate.format( this.modelFrom );
    this.role = this.auth.getUserRol();

    this.loadData();
  }

  private loadData( page = 1 ): void {
    if ( this.role === 'merchant' ) {
      const params = `store=${this.store._id}&best=${this.order}&report=true&from=${this.fechaIni}&to=${this.fechaFin}`;
      this.reports.bestSellers( page, params ).subscribe( result => {
        this.bestSellers = [ ...result ];
      } );
    }

    if ( this.role === 'admin' ) {
      const params = `best=${this.order}&report=true&from=${this.fechaIni}&to=${this.fechaFin}`;
      this.reports.bestSellersMP( params ).subscribe( response => {
        this.bestSellers = [ ...response.result ];
      } );
    }

  }

  setPage( page: number ) {
    this.loadData( page );
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

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'best-sellers-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Productos más vendidos', 'best-sellers-report' );
  }

}
