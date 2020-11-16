import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Product } from 'src/app/shared/classes/product';
import { ExportService } from 'src/app/shared/services/export.service';
import { CustomDateParserFormatterService } from '../../../shared/adapter/custom-date-parser-formatter.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../../../shared/services/reports.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Filter } from '../../../shared/classes/filter';

@Component( {
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: [ './best-sellers.component.scss' ]
} )
export class BestSellersComponent implements OnInit, OnChanges {
  @ViewChild( 'TABLE', { read: ElementRef } ) table: ElementRef;


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

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
    private ngbCalendar: NgbCalendar,
    private exportDoc: ExportService,
    private categoriesSevice: CategoryService,
    private parseDate: CustomDateParserFormatterService
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.filters.storeId = '';
    this.loadStores();
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
    const params = `from=${this.filters.fechaIni}&to=${this.filters.fechaFin}&store=${this.filters.storeId}&category=${this.categoryId}`;
    this.reports.bestSellers( params ).subscribe( response => {
      this.bestSellers = [ ...response ];
    } );
  }

  private loadStores(): void {
    this.reports.membershipActiveShop( 1, `report=false` ).subscribe( result => {
      this.stores = result.docs;
    } );
  }

  private loadStoreCategories(): void {
    const params = `store=${this.store._id}`;
    this.categoriesSevice.getSubcategory( params ).subscribe( subcategories => {
    } );
  }
}
