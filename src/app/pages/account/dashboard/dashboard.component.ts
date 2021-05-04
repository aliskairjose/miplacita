import { Component, Input, OnChanges } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/classes/user';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Dashboard } from '../../../shared/classes/dashboard';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Color, Label } from 'ng2-charts';
import { Store } from '../../../shared/classes/store';
import { OrderService } from 'src/app/shared/services/order.service';
import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';

export interface DashboardProduct {
  name: string;
  quantitySold: number;
}
@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )

export class DashboardComponent implements OnChanges {

  months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic' ];
  openDashboard = false;
  dashboardData: Dashboard = new Dashboard();

  /** Table fields */
  tableHeaders = [ 'PEDIDO NRO', 'CLIENTE', 'FECHA DE EMISIÓN', 'ESTATUS' ];
  tableHeadersAdmin = [ 'TIENDA', 'MONTO', 'FECHA' ];

  paginate: any = {};
  pageNo = 1;
  pageSize = 5;
  shops = [];
  orders = [];
  /** Google Chart information */
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: 'none'
  };
  barChartColors: Color[] = [ { backgroundColor: '#68396d' } ];
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartData: ChartDataSets[] = [];

  doughnutChartLabels: Label[] = [];
  doughnutChartData: SingleDataSet = [];
  doughnutChartType: ChartType = 'doughnut';
  doughnutColors: Color[] = [ { backgroundColor: [ '#c6410f', '#eca89e' ] } ];
  salesChart = [];
  adminPieChart = [];
  storePieChart = [];
  role: string;
  user: User = {};

  bestSellers: DashboardProduct[] = [];
  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private toastrService: ToastrService,
    public productService: ProductService,
    public dashboardService: DashboardService,
    private orderService: OrderService
  ) {
    this.auth.authObserver().subscribe( ( resp: boolean ) => {
      if ( resp ) {
        this.toastrService.info( `Bienvenido ${this.user.fullname}` );
      }
    } );

    this.dashboardData.month_orders = [];
    this.dashboardData.sold_products = [];

    this.role = this.auth.getUserRol();
    this.user = this.auth.getUserActive();

  }

  ngOnChanges(): void {
    this.getLabelsInformation();
    this.loadData();
  }

  getLabelsInformation() {

    if ( Object.entries( this.store ).length === 0 ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    }

    if ( this.role === 'admin' ) {
      this.dashboardService.dashboard().subscribe( ( response: any ) => {
        if ( response.success ) {
          this.dashboardData = response.result;
        }
      } );
      return;
    }

    this.dashboardService.dashboardStore( `store=${this.store._id}` ).subscribe( ( data: Dashboard ) => {
      this.doughnutChartData.length = 0;
      this.doughnutChartLabels.length = 0;
      this.barChartData.length = 0;
      this.barChartLabels.length = 0;

      this.dashboardData = { ...data };

      if ( this.dashboardData.sold_products.length ) {
        this.bestSellers = this.dashboardData.sold_products.filter( ( product: DashboardProduct ) => product.quantitySold > 0 );
        if ( this.bestSellers.length <= 5 ) {
          const source = from( this.bestSellers );
          const names = source.pipe( pluck( 'name' ) );
          const quantitySold = source.pipe( pluck( 'quantitySold' ) );

          names.subscribe( _name => this.doughnutChartLabels.push( _name ) );
          quantitySold.subscribe( _quantitySold => this.doughnutChartData.push( _quantitySold ) );
        }
      }

      const barTemporal = [];
      if ( this.dashboardData.month_orders.length ) {
        this.dashboardData.month_orders.map( ( elemt: any ) => {
          const month = this.months[ +elemt._id.month - 1 ];
          this.barChartLabels.push( `${month} ${elemt._id.year}` );
          barTemporal.push( elemt.total );
        } );
      }
      this.barChartData.push( { data: barTemporal } );
    } );

  }


  slicePage( items ) {
    return ( items.length > this.pageSize ) ? items.slice( 0, this.pageSize ) : items;
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    if ( Object.entries( this.store ).length === 0 ) {
      this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    }
    let params = '';
    if ( this.role === 'merchant' ) {
      params = `store=${this.store._id}`;
      this.orderService.orderList( page, params ).subscribe( result => {
        this.orders = [ ...result.docs ];
        this.paginate = { ...result, pages: [] };

        for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
          this.paginate.pages.push( i );
        }
      } );
    }
    if ( this.role === 'admin' ) {
      params = `status=&from=&to=`;
    }
  }

}
