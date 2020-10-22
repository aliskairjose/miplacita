import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Product } from 'src/app/shared/classes/product';
import { ExportService } from 'src/app/shared/services/export.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
    private exportDoc: ExportService,
    private parseDate: CustomDateParserFormatterService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  private init(): void {
    this.role = this.auth.getUserRol();

    this.loadData();
  }

  private loadData( page = 1 ): void {
    const params = `store=${this.store._id}&best=${this.order}`;
    this.reports.bestSellers( page, params ).subscribe( result => {
      this.bestSellers = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }

    } );
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
