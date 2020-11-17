import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { ShopService } from '../../../shared/services/shop.service';

@Component( {
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: [ './referrals.component.scss' ]
} )
export class ReferralsComponent implements OnInit, OnChanges {

  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  submitted = false;
  referralForm: FormGroup;
  referrals = [];
  fields = [ 'Fecha', 'Código', 'Cliente' ];
  user: User;
  paginate: Paginate;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private shopService: ShopService,
  ) { }

  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( this.auth.getUserRol() === 'merchant' ) {
        this.store = store;
      }
    } );
  }

  ngOnInit(): void {
    this.user = this.auth.getUserActive();

  }
  get f() { return this.referralForm.controls; }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    // conexion con api de lista de referidos
  }
}
