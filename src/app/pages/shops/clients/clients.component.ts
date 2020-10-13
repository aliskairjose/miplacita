import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { User } from 'src/app/shared/classes/user';
import { InterestsComponent } from '../../interests/interests.component';
import { ExportService } from 'src/app/shared/services/export.service';
import { ShopService } from 'src/app/shared/services/shop.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  @ViewChild( 'interests' ) Interests: InterestsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = ['Cliente', 'Email','Número de compras', ''];
  clients: any = [];
  paginate: Paginate;
  role: string;
  
  @Input() store: Store;
  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private shopService: ShopService,
    private exportDoc: ExportService) { }

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

    const params = `store=${this.store._id}`;

    this.shopService.clientsList(params ).subscribe( result => {
      console.log("result",result);
      
        this.clients = result;
        console.log(this.clients);
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

  ExportTOExcel( ) {
    this.exportDoc.ExportTOExcel(this.table.nativeElement,"clients-report");
  }

  ExportTOPDF( ) {
    this.exportDoc.ExportTOPDF('#mp-table','Clientes','clients-report');
  }

}
