import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginate } from 'src/app/shared/classes/paginate';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShopService } from 'src/app/shared/services/shop.service';
import { CreateMembershipComponent } from '../create-membership/create-membership.component';

@Component( {
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: [ './memberships.component.scss' ]
} )
export class MembershipsComponent implements OnInit {
  @ViewChild( 'createMembership' ) CreateMembership: CreateMembershipComponent;

  paginate: Paginate;
  plans = [];
  fields = [ 'Nombre', 'Precio', '' ];
  role = '';
  constructor(
    private shopService: ShopService,
    private auth: AuthService ) {
    this.role = this.auth.getUserRol();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData( page = 1 ) {

    this.shopService.getPlans().subscribe( ( plans ) => this.plans = [ ...plans ] );
  }

  setPage( page: number ) {
    this.loadData( page );
  }

  reloadPage( event: boolean ): void {
    if ( event ) { this.loadData(); }
  }

}
