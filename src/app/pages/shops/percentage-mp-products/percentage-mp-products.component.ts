import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Store } from '../../../shared/classes/store';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { Filter } from '../../../shared/classes/filter';
import { FiltersComponent } from '../../../shared/components/filters/filters.component';

@Component( {
  selector: 'app-percentage-mp-products',
  templateUrl: './percentage-mp-products.component.html',
  styleUrls: [ './percentage-mp-products.component.scss' ]
} )
export class PercentageMpProductsComponent implements OnInit, AfterViewInit {

  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;
  @ViewChild( 'filter' ) filterComponnt: FiltersComponent;

  fields = [ 'Fecha', 'Tipo', 'Tienda', 'Ganancia Total' ];
  fieldsHeader = [ '20% MP', '% Tienda' ];
  data: any = {};
  role: string;
  stores: Store[] = [];
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  noData: boolean;
  filters: Filter = {};

  constructor(
    private auth: AuthService,
    private ngbCalendar: NgbCalendar,
    private reportService: ReportsService,
    private parseDate: CustomDateParserFormatterService,
  ) { }

  ngAfterViewInit(): void {
    this.filterComponnt.setElement( this.table )
  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.init();
  }

  init() {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filters.fechaIni = this.filters.fechaFin = this.parseDate.format( this.modelFrom );
    this.filters.storeId = '';
    this.loadData();
  }

  filtrar( filter: Filter ): void {
    this.filters = filter;
    this.loadData();
  }

  private loadData() {
    const params = `from=${this.filters.fechaIni}&to=${this.filters.fechaFin}&store=${this.filters.storeId}`;

    this.reportService.percentageMpSales( params ).subscribe( response => {
      this.data = { ...response };
      this.noData = response.result.length;
    } );
  }

}
