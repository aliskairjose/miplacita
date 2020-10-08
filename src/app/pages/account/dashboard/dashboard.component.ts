import { Component, OnInit, Input } from '@angular/core';
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
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/adapter/custom-date-parser-formatter.service';
@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  openDashboard = false;
  dashboardData: Dashboard = new Dashboard();

  /** Table fields */
  tableHeaders = [ 'PEDIDO NRO', 'CLIENTE', 'FECHA DE EMISIÓN', 'ESTATUS' ];

  paginate: any = {};
  pageNo = 1;
  pageSize = 5;
  shops = [];
  orders = [];
  /** Google Chart information */
  barChartColumns = [ 'Mayo', 'Junio', 'Julio', 'Agosto' ];
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
  doughnutColors: Color[] = [ { backgroundColor: [ '#d0260f', '#eca89e' ] } ];
  salesChart = [];
  adminPieChart = [];
  storePieChart = [];
  role: string;
  user: User = {};

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private toastrService: ToastrService,
    public productService: ProductService,
    public dashboardService: DashboardService,
    private orderService: OrderService,
    private ngbCalendar: NgbCalendar,
    private parseDate: CustomDateParserFormatterService

  ) {
    this.role = this.auth.getUserRol();
    this.user = this.auth.getUserActive();
  }

  async ngOnInit() {
    await this.auth.authObserver().subscribe( async ( resp: boolean ) => {
      if ( resp ) {
        this.toastrService.info( `Bienvenido ${this.user.fullname}` );
      }
    } );

    this.getLabelsInformation();
    this.getChartInformation();
    this.loadData();
  }
  getLabelsInformation() {
    this.dashboardService.dashboard().subscribe( ( data: any ) => {
      this.dashboardData = data.result;
    } );
  }

  

  getChartInformation() {
    /** carga de datos para las estadisticas */

  }

  slicePage( items ) {
    if ( items.length > this.pageSize ) {
      return items.slice( 0, this.pageSize );
    } else {
      return items;
    }
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    let params = '';
   
    // const params = `store=${this.store._id}&status=${this.status}&from=${this.fechaIni}&to=${this.fechaFin}`;
    if ( this.role === 'merchant' ) {
      params = `store=${this.store._id}&status=&from=&to=`;
    }

    if ( this.role === 'admin' ) {
      params = `status=&from=&to=`;
    }

    this.orderService.orderList( page, params ).subscribe( result => {
      console.log(result);
      this.orders = [ ...result.docs ];
      console.log(this.orders);
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );
  }

}
