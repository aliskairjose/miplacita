import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/classes/user';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Dashboard } from '../../../shared/classes/dashboard';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartDataSets, ChartData } from 'chart.js';
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

  months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul','Ago', 'Sept','Oct','Nov','Dic'];
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
    this.dashboardData.month_orders = [];
    this.dashboardData.sold_products = [];
    
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
      let params = ''
      params = `store=${this.store._id}`;


    this.dashboardService.dashboard_store(params).subscribe( ( data: any ) => {
      console.log("->>",data);
      this.dashboardData = data.dashboard;
      if(this.dashboardData.sold_products.length>0){
        if(this.dashboardData.sold_products.length > 3){
          this.dashboardData.sold_products.sort(function (a:any, b:any) {
            if (a.quantitySold < b.quantitySold) {
              return 1;
            }
            if (a.quantitySold > b.quantitySold) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          console.log(this.dashboardData.sold_products);
          for(let i= 0;i< 3;i++ ){
            
            let element: any = this.dashboardData.sold_products[i];
            if(element.quantitySold>0){
              this.doughnutChartLabels.push(element.name);
              this.doughnutChartData.push(element.quantitySold);
            }
          }
        } else {
          this.dashboardData.sold_products.map((element:any) => {
            this.doughnutChartLabels.push(element.name);
            this.doughnutChartData.push(10);
          })
        }
        
        
      }
      let barTemporal = [];
      if(this.dashboardData.month_orders.length > 0){
        this.dashboardData.month_orders.map((elemt:any) => {
          let month = this.months[+elemt._id.month - 1];
          this.barChartLabels.push(month + ' ' + elemt._id.year);
          barTemporal.push(elemt.total);
        })
      }
      this.barChartData.push({data: barTemporal});

    });
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
      params = `store=${this.store._id}`;

    }

    if ( this.role === 'admin' ) {
      params = `status=&from=&to=`;
    }
    

    this.orderService.orderList( page, params ).subscribe( result => {
      this.orders = [ ...result.docs ];
      this.paginate = { ...result };
      this.paginate.pages = [];
      for ( let i = 1; i <= this.paginate.totalPages; i++ ) {
        this.paginate.pages.push( i );
      }
    } );

  }

}
