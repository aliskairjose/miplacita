import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../../shared/services/reports.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Filter } from '../../../shared/classes/filter';
import { FiltersComponent } from '../../../shared/components/filters/filters.component';

@Component( {
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: [ './best-sellers.component.scss' ]
} )
export class BestSellersComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;
  @ViewChild( 'filter' ) filterComponent: FiltersComponent;


  adminFields = [ 'ID', 'Producto', 'Tienda', 'Cantidad Vendida' ];
  fields = [ 'ID', 'Producto', 'Categoria', 'Cantidad Vendida' ];

  bestSellers = [];
  paginate: Paginate;
  role: string;
  order = 'desc';
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  categoryId = '';
  stores: Store[] = [];
  filters: Filter = {};
  hasStores: boolean;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
    private ngbCalendar: NgbCalendar,
    private parseDate: CustomDateParserFormatterService
  ) {
    this.hasStores = this.auth.getUserRol() === 'admin';
  }

  ngAfterViewInit(): void {
    this.filterComponent.setElement( this.table );
  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.filters.storeId = '';
    this.init();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }

  filtrar( filter: Filter ): void {
    this.filters = filter;
    this.loadData();
  }

  private init(): void {
    this.modelFrom = this.modelTo = this.ngbCalendar.getToday();
    this.filters.fechaIni = this.filters.fechaFin = this.parseDate.format( this.modelFrom );
    this.role = this.auth.getUserRol();

    this.loadData();
  }

  private loadData(): void {
    let storeId = '';
    ( this.auth.getUserRol() === 'admin' ) ? storeId = this.filters.storeId : storeId = this.store._id;
    const params = `from=${this.filters.fechaIni}&to=${this.filters.fechaFin}&store=${storeId}`;
    // tslint:disable-next-line: deprecation
    this.reports.bestSellers( params ).subscribe( response => {
      this.bestSellers = [ ...response ];
    } );
  }

}
