import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { User } from 'src/app/shared/classes/user';
import { InterestsComponent } from '../../interests/interests.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  @ViewChild( 'interests' ) Interests: InterestsComponent;

  fields = ['Cliente', 'Email','Número de compras', ''];
  clients: User[] = [ {  _id : "string",
    avatar: "string",
    fullname: "string",
    email: "string",    role: "string",
    }]
  paginate: Paginate;
  role: string;
  
  @Input() store: Store;
  constructor(private auth: AuthService,
              private orderService: OrderService ) { }

  ngOnInit(): void {
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  private init(): void {
    this.role = this.auth.getUserRol();
    this.loadData();
  }
  
  private loadData( page = 1 ): void {

  // conexion de api
  }


  setPage( page: number ) {
    this.loadData( page );
  }

}
