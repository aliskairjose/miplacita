import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { User } from 'src/app/shared/classes/user';
import { InterestsComponent } from '../../interests/interests.component';
import { ExportService } from 'src/app/shared/services/export.service';
import { ShopService } from 'src/app/shared/services/shop.service';

@Component( {
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: [ './clients.component.scss' ]
} )
export class ClientsComponent implements OnInit, OnChanges {
  @ViewChild( 'interests' ) Interests: InterestsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Cliente', 'Email', 'Número de compras', '' ];
  clients: any = [];
  paginate: Paginate;
  role: string;

  @Input() store: Store;
  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private shopService: ShopService,
    private exportDoc: ExportService ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.role = this.auth.getUserRol();

    if(this.role == 'merchant'){
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );

    }
    this.init();
  }

  private init(): void {
    if(this.role == 'merchant'){
      this.loadData();
    } else {
      this.shopService.clientsList( '' ).subscribe( result => {
        this.clients = result;
        this.paginate = { ...result };
        this.paginate.pages = [];
        for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
          this.paginate.pages.push( i );
        }
      } );
    }
  }

  private loadDataForAdmin( ): void {
    console.log("admin");
  }
  
  private loadData( page = 1 ): void {
    
    const params = `store=${this.store._id}`;

    this.shopService.clientsList( params ).subscribe( result => {
      this.clients = result;
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
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'clients-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Clientes', 'clients-report' );
  }

}
