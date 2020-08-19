import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/tm.product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public typeUser = 'merchant';
  public fields = ['ID', 'Cliente', 'Productos', 'Monto', 'Zona de Entrega',
                   'Estado', '' ];
  
  public orders = [];
  public states = []; // estados de las ordenes

  public paginate: any = {};
  public pageNo = 1;
  public pageSize = 5;
  public allOrders = [{
    id: 1,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3',
    
  ],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 2,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },{
    id: 3,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 4,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 5,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 6,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 7,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },{
    id: 8,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 9,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 10,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  },
  {
    id: 11,
    client: 'cliente',
    products: ['producto1','producto 2', 'producto 3'],
    amount: 100.00,
    zone: 'Panamá',
    state: 'Entregado'
  }

  ];
  public searchForm: FormGroup;
  constructor(public productService: ProductService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.getTableInformation();
  }

  createForm(){
    this.searchForm = this.formBuilder.group({
      init: [''],
      end: [''],
      state: ['']
    });
  }

  slicePage(items){
    if (items.length > this.pageSize ){
      return items.slice(0, this.pageSize );
    } else {
      return items;
    }
  }

  getTableInformation(){
    //** carga de datos desde api */

      this.paginate = this.productService.getPager(this.allOrders.length, +this.pageNo, this.pageSize );
      this.orders = this.slicePage(this.allOrders);
  }

  setPage(event){
    const end = event * this.paginate.pageSize;
    this.paginate.startIndex = end - this.paginate.pageSize;
    if (event === this.paginate.endPage){
      this.orders = this.allOrders.slice(this.paginate.startIndex );
      this.paginate.endIndex = this.allOrders.length - 1;
    } else {
      this.paginate.endIndex = end - 1;
      this.orders = this.allOrders.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    }
    this.paginate.currentPage = event;
  }

  search(){
    console.log(this.searchForm.value)
  }

}
