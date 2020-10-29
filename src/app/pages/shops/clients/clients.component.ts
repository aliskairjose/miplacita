import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { InterestsComponent } from '../../interests/interests.component';
import { ExportService } from 'src/app/shared/services/export.service';
import { ReportsService } from '../../../shared/services/reports.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: [ './clients.component.scss' ]
} )
export class ClientsComponent implements OnInit, OnChanges {
  @ViewChild( 'interests' ) Interests: InterestsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  fields = [ 'Cliente', 'Email' ];
  clients: any = [];
  paginate: Paginate;
  roles = [
    {
      value: '',
      name: 'Todos'
    },
    {
      value: 'client',
      name: 'Cliente'
    },
    {
      value: 'merchant',
      name: 'Tienda'
    },
  ];

  role: string;
  _role = '';
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
    private ngbCalendar: NgbCalendar,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.role = this.auth.getUserRol();

    if ( this.role === 'merchant' ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );

    }
    this.init();
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

  onRoleChange( role: string ): void {
    this._role = role;
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );

  }

  private loadData( page = 1 ): void {

    if ( this.role === 'merchant' ) {
      const params = `store=${this.store._id}`;

      this.reports.clients( params ).subscribe( result => {
        this.clients = result;
        this.paginate = { ...result };
        this.paginate.pages = [];
        for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
          this.paginate.pages.push( i );
        }
      } );
    }

    if ( this.role === 'admin' ) {
      this.reports.clientsMP( this._role, this.fechaIni, this.fechaFin ).subscribe( response => {
        this.clients = response.result;
      } );
    }

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
