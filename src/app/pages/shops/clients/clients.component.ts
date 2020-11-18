import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { InterestsComponent } from '../../interests/interests.component';
import { ReportsService } from '../../../shared/services/reports.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../../../shared/classes/filter';

@Component( {
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: [ './clients.component.scss' ]
} )
export class ClientsComponent implements OnInit, OnChanges {
  @ViewChild( 'interests' ) Interests: InterestsComponent;
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  adminFields = [ 'Cliente', 'Email', 'Fecha de registro', 'Role', 'Acción' ];
  fields = [ 'Cliente', 'Email', 'Acción' ];
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
  filters: Filter = {};
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
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

  filtrar( filters: Filter ): void {
    this.filters = filters;
    this.loadData();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filters.fechaFin = this.filters.fechaIni = this.parseDate.format( this.modelFrom );
    this.loadData();
  }

  private loadData(): void {

    if ( this.role === 'merchant' ) {
      const params = `store=${this.store._id}`;

      this.reports.clients( params ).subscribe( result => {
        this.clients = result;
      } );
    }

    if ( this.role === 'admin' ) {
      this.reports.clientsMP( this.filters.role, this.filters.fechaIni, this.filters.fechaFin ).subscribe( response => {
        this.clients = response.result;
      } );
    }

  }

}
