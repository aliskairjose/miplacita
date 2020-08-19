import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/tm.product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';

@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  public openDashboard = false;
  public typeUser = 'merchant'; // type user
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

  public dailySale = '2 ventas hoy';
  public totalSale = '30 ventas totales ';
  public totalClients = '20 clientes';
  public totalProducts = '50 productos';
  /** variables provisionales  con data random*/

  public allOrders = [
    {
      name: 'pedido 1',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 2',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },

    {
      name: 'pedido 3',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 4',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 5',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 6',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 7',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 8',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 9',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 10',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 11',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 12',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 13',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 14',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, {
      name: 'pedido 15',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    },
    {
      name: 'pedido 16',
      status: 'pendiente',
      description: 'un pedido x con muchos productos',
      price: '88.$'
    }, ];

  public allshops = [
    {
      name: 'tienda 1',
      amount: '45$',
      date: '12-10-2020'
    }
  ];
  public salesChart = [
    [ 'Mayo', 19500000 ],
    [ 'Junio', 8136000 ],
    [ 'Julio', 8538000 ],
    [ 'Agosto', 2244000 ],
  ];

  public adminPieChart = [
    [ 'Tienda 1', 19500000 ],
    [ 'Tienda 2', 8136000 ],
    [ 'Tienda 3', 8538000 ],
    [ 'Tienda 4', 2244000 ],
    [ 'Tienda 5', 19500000 ],
    [ 'Tienda 6', 8136000 ],
  ];

  public storePieChart = [
    [ 'Producto 1', 19500000 ],
    [ 'Producto 2', 8136000 ],
    [ 'Producto 3', 8538000 ],
    [ 'Producto 4', 2244000 ],
    [ 'Producto 5', 19500000 ],
    [ 'Producto 6', 8136000 ],
  ];

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    public productService: ProductService,
  ) { }
  
  ngOnInit(): void {
    this.auth.authObserver().subscribe( ( resp: boolean ) => {
      console.log( resp );
      if ( resp ) {
        const user: User = this.storage.getItem( 'user' );
        this.alert.info( `Bienvenido ${user.fullname}` );
      }
    } );
    this.getTableInformation();
    this.getChartInformation();
  }

  getTableInformation() {
    // ** carga de datos desde api */
    if ( this.typeUser === 'merchant' ) {
      this.fields = this.storeFields;
      this.paginate = this.productService.getPager( this.allOrders.length, +this.pageNo, this.pageSize );

      this.orders = this.slicePage( this.allOrders );
    } else if ( this.typeUser === 'admin' ) {
      this.fields = this.adminFields;
      this.paginate = this.productService.getPager( this.allshops.length, +this.pageNo, this.pageSize );

      this.shops = this.slicePage( this.allshops );
    }
  }

  getChartInformation() {
    /** carga de datos para las estadisticas */
    this.barChartData = this.salesChart;
    this.barChartTitle = 'Ventas';
    if ( this.typeUser === 'merchant' ) {
      this.pieChartData = this.storePieChart;
      this.pieChartTitle = 'Más vendidos este mes';

    } else if ( this.typeUser === 'admin' ) {
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
    if ( event === this.paginate.endPage ) {
      const end = event * this.paginate.pageSize;
      this.paginate.startIndex = end - this.paginate.pageSize;

      if ( this.typeUser === 'merchant' ) {
        this.orders = this.allOrders.slice( this.paginate.startIndex );
        this.paginate.endIndex = this.allOrders.length - 1;

      } else if ( this.typeUser === 'admin' ) {
        this.shops = this.allshops.slice( this.paginate.startIndex );
        this.paginate.endIndex = this.allshops.length - 1;

      }
    } else {
      const end = event * this.paginate.pageSize;
      this.paginate.startIndex = end - this.paginate.pageSize;

      this.paginate.endIndex = end - 1;
      if ( this.typeUser === 'merchant' ) {
        this.orders = this.allOrders.slice( this.paginate.startIndex, this.paginate.endIndex + 1 );
      } else if ( this.typeUser === 'admin' ) {
        this.shops = this.allshops.slice( this.paginate.startIndex, this.paginate.endIndex + 1 );
      }
    }
    this.paginate.currentPage = event;
  }

}
