import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Dashboard } from '../../../shared/classes/dashboard';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Color, Label } from 'ng2-charts';
@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  public openDashboard = false;
  public user: User = new User();
  public dashboardData: Dashboard = new Dashboard();

  /** Table fields */
  public fields = [];

  /** table fields by type user */
  public storeFields = [  { name: 'Pedidos nro' },
                          { name: 'Descripción' },
                          { name: 'Fecha de emisión' },
                          { name: 'Estatus de entrega' } ];
  public adminFields = [  { name: 'Tienda' },
                          { name: 'Monto' },
                          { name: 'Fecha' } ];
  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 5;
  public shops = [];
  public orders = [];
  /** Google Chart information */
  public barChartColumns = [ 'Mayo', 'Junio', 'Julio', 'Agosto' ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: 'none'
  };
  public barChartColors: Color[] = [{backgroundColor: '#68396d'}];

  public barChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  public barChartType: ChartType = 'bar';

  barChartData: ChartDataSets[] = [
    { data: [0.3, 37, 60, 70, 46, 33]}
  ];
  public doughnutChartLabels: Label[] = ['Producto 1', 'Producto 2'];

  public doughnutChartData: SingleDataSet = [50, 50];

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutColors: Color[] = [{backgroundColor: ['#d0260f','#eca89e']}];
  public salesChart = [];

  public adminPieChart = [];

  public storePieChart = [];

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private toastrService: ToastrService,
    public productService: ProductService,
    public dashboardService: DashboardService
  ) {
    this.user = this.storage.getItem( 'user' );
  }

  async ngOnInit() {
    await this.auth.authObserver().subscribe( async ( resp: boolean ) => {
      if ( resp ) {
        this.toastrService.info( `Bienvenido ${this.user.fullname}` );
      }
    } );
    this.getLabelsInformation();
    this.getTableInformation();
    this.getChartInformation();
  }
  getLabelsInformation() {
    this.dashboardService.dashboard().subscribe((data: any) => {
      this.dashboardData = data.result;
    });
  }

  getTableInformation() {
    // ** carga de datos desde api */
    if ( this.user.role === 'merchant' ) {
      this.fields = this.storeFields;
      // this.paginate = this.productService.getPager( this.allOrders.length, +this.pageNo, this.pageSize );

      // this.orders = this.slicePage( this.allOrders );
    } else if ( this.user.role === 'admin' ) {
      this.fields = this.adminFields;
      // this.paginate = this.productService.getPager( this.allshops.length, +this.pageNo, this.pageSize );

      // this.shops = this.slicePage( this.allshops );
    }
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

  setPage( event ) {
    // if ( event === this.paginate.endPage ) {
    //   const end = event * this.paginate.pageSize;
    //   this.paginate.startIndex = end - this.paginate.pageSize;

    //   if ( this.user.role === 'merchant' ) {
    //     this.orders = this.allOrders.slice( this.paginate.startIndex );
    //     this.paginate.endIndex = this.allOrders.length - 1;

    //   } else if ( this.user.role === 'admin' ) {
    //     this.shops = this.allshops.slice( this.paginate.startIndex );
    //     this.paginate.endIndex = this.allshops.length - 1;

    //   }
    // } else {
    //   const end = event * this.paginate.pageSize;
    //   this.paginate.startIndex = end - this.paginate.pageSize;

    //   this.paginate.endIndex = end - 1;
    //   if ( this.user.role === 'merchant' ) {
    //     this.orders = this.allOrders.slice( this.paginate.startIndex, this.paginate.endIndex + 1 );
    //   } else if ( this.user.role === 'admin' ) {
    //     this.shops = this.allshops.slice( this.paginate.startIndex, this.paginate.endIndex + 1 );
    //   }
    // }
    // this.paginate.currentPage = event;
  }

}
