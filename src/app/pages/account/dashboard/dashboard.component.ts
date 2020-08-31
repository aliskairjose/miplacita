import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Dashboard } from '../../../shared/classes/dashboard';

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
  public storeFields = [ { name: 'Pedidos' },
  { name: 'Status' },
  { name: 'Descripción' },
  { name: 'Precio' } ];
  public adminFields = [ { name: 'Tienda' },
  { name: 'Monto' },
  { name: 'Fecha' } ];
  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 5;
  public shops = [];
  public orders = [];
  /** Google Chart information */
  public barChartOptions = { legend: 'none', colors: [ '#ff4c3b' ] };
  public barChartColumns = [ 'Mayo', 'Junio', 'Julio', 'Agosto' ];
  public barChartTitle = '';
  public pieChartTitle = '';
  public barChartData = [];
  public pieChartData = [];

  public salesChart = [];

  public adminPieChart = [];

  public storePieChart = [];

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    public productService: ProductService,
    public dashboardService: DashboardService
  ) {
    this.user = this.storage.getItem( 'user' );
  }

  async ngOnInit() {
    await this.auth.authObserver().subscribe( async ( resp: boolean ) => {
      if ( resp ) {
        this.alert.info( `Bienvenido ${this.user.fullname}` );
      }
    } );
    await this.getLabelsInformation();
    await this.getTableInformation();
    await this.getChartInformation();
  }
  getLabelsInformation() {
    this.dashboardService.dashboard().subscribe((data: any) => {
      console.log(data);
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
    this.barChartData = this.salesChart;
    this.barChartTitle = 'Ventas';
    if ( this.user.role === 'merchant' ) {
      this.pieChartData = this.storePieChart;
      this.pieChartTitle = 'Más vendidos este mes';

    } else if ( this.user.role === 'admin' ) {
      this.pieChartData = this.adminPieChart;
      this.pieChartTitle = 'Ventas por tienda';

    }
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
