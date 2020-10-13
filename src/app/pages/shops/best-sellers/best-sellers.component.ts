import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Product } from 'src/app/shared/classes/product';
import { ExportService } from 'src/app/shared/services/export.service';
import { ProductService } from 'src/app/shared/services/product.service';

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
  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private exportDoc: ExportService,
    private productService: ProductService,
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
    this.productService.productList( page, params ).subscribe( result => {
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

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'best-sellers-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Productos más vendidos', 'best-sellers-report' );
  }

}
