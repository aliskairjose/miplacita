import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Store } from '../../classes/store';
import { ReportsService } from '../../services/reports.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../../adapter/custom-date-parser-formatter.service';
import { ExportService } from '../../services/export.service';
import { ToastrService } from 'ngx-toastr';
import { Filter } from '../../classes/filter';

@Component( {
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: [ './filters.component.scss' ]
} )
export class FiltersComponent implements OnInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;

  storeSelected: Store = {};
  stores: Store[] = [];
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  fechaIni = '';
  fechaFin = '';
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

  role = '';
  private _storeID = '';

  @Input() storeList: boolean;
  @Input() roleList: boolean;
  @Input() canExport: boolean;
  @Input() dateRange = true;

  @Output() filter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private report: ReportsService,
    private exportDoc: ExportService,
    private ngbCalendar: NgbCalendar,
    private parseDate: CustomDateParserFormatterService
  ) {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.fechaIni = this.parseDate.format( this.modelFrom );
    this.fechaFin = this.parseDate.format( this.modelTo );
  }

  ngOnInit(): void {
    if ( this.storeList ) { this.loadStores(); }
  }

  selectStore( store: Store ): void {
    if ( store ) {
      this.storeSelected = store;
      this._storeID = store._id;
    } else {
      this.storeSelected.name = null;
      this._storeID = '';
    }
  }

  onRoleChange( role: string ): void {
    this.role = role;
  }

  ExportTOExcel() {
    this.exportDoc.ExportTOExcel( this.table.nativeElement, 'stock-report' );
  }

  ExportTOPDF() {
    this.exportDoc.ExportTOPDF( '#mp-table', 'Inventario', 'stock-report' );
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

    const data: Filter = {};
    data.storeId = this._storeID;
    data.fechaIni = this.fechaIni;
    data.fechaFin = this.fechaFin;
    data.role = this.role;

    this.filter.emit( data );

  }

  private loadStores(): void {
    this.report.membershipActiveShop( 1, `report=false` ).subscribe( res => {
      this.stores = res.docs;
    } );
  }

}
