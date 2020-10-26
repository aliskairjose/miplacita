import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';
import { ShopDetailsComponent } from '../../shared/components/shop-details/shop-details.component';
import { Paginate } from '../../shared/classes/paginate';
import { Store } from '../../shared/classes/store';
import { Result } from '../../shared/classes/response';
import { ExportService } from 'src/app/shared/services/export.service';
import { ReportsService } from '../../shared/services/reports.service';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit {

  @ViewChild( 'shopDetails' ) ShopDetails: ShopDetailsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  searchText = '';
  fields = [ 'Tienda', 'Plan', 'Precio', 'Activo', 'Opciones' ];
  fieldsAdmin = [ 'Tienda', 'Dueño', 'Tipo de Membresía', 'Monto de membresía', 'Estado' ];
  shops: Store[] = [];
  paginate: Paginate;
  @Input() type = 'stores';

  constructor(
    public productService: ProductService,
    private reports: ReportsService,
    private exportDoc: ExportService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    this.reports.membershipActiveShop( page ).subscribe( ( result ) => {
      this.shops = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'daily-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Ventas diarias', 'daily-report' );
  }

}
