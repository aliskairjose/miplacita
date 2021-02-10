import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ProductService } from '../../shared/services/tm.product.service';
import { ShopDetailsComponent } from '../../shared/components/shop-details/shop-details.component';
import { Paginate } from '../../shared/classes/paginate';
import { Store } from '../../shared/classes/store';
import { Result } from '../../shared/classes/response';
import { ExportService } from 'src/app/shared/services/export.service';
import { ReportsService } from '../../shared/services/reports.service';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { ShopService } from '../../shared/services/shop.service';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit, OnChanges {

  @ViewChild( 'shopDetails' ) ShopDetails: ShopDetailsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  searchText = '';
  fields = [ 'Tienda', 'Plan', 'Precio', 'Activo', 'Opciones' ];
  fieldsAdmin = [ 'Tienda', 'Dueño', 'Tipo de Membresía', 'Monto de membresía', 'Estado' ];
  shops: Store[] = [];
  paginate: Paginate;

  @Input() isReport = false;

  constructor(
    private toast: ToastrService,
    private reports: ReportsService,
    private exportDoc: ExportService,
    private storeService: ShopService,
    public productService: ProductService,
    private confirmationDialogService: ConfirmationDialogService,

  ) {
  }
  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit(): void {
    this.loadData();
  }

  deactivateStore( store: Store ): void {
    this.confirmationDialogService
      .confirm(
        'Por favor confirme...',
        `¿Realmente desea activar/desactivar la tienda ${store.name}?`,
        'Si, desactivar!',
        'No desactivar',
        'lg'
      )
      .then( ( confirmed ) => {
        // tslint:disable-next-line: curly
        if ( confirmed ) this.deactivate( store._id, !store.active );
      } );
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private deactivate( id: string, status ): void {
    // tslint:disable-next-line: deprecation
    this.storeService.updateStoreStatus( id, { active: status } ).subscribe( response => {
      if ( response.success ) {
        this.toast.info( 'La Tienda ha sido desactivada' );
        this.loadData();
      }
    } );
  }

  private loadData( page = 1 ): void {
    // Reportes no llevan paginacion
    let params = '';
    ( this.isReport ) ? params = `active=true&report=${this.isReport}` : params = `report=${this.isReport}`;

    // tslint:disable-next-line: deprecation
    this.reports.membershipActiveShop( page, params ).subscribe( result => {

      if ( this.isReport ) { this.shops = result; }

      if ( !this.isReport ) {
        this.shops = result.docs;
        this.paginate = { ...result };
        this.paginate.pages = [];
        for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
          this.paginate.pages.push( i );
        }
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
