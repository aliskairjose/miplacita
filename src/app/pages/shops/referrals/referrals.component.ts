import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';
import { ShopService } from '../../../shared/services/shop.service';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';
import { ERROR_FORM } from '../../../shared/classes/global-constants';

@Component( {
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: [ './referrals.component.scss' ]
} )
export class ReferralsComponent implements OnInit, OnChanges {

  invalidEmail = ERROR_FORM.invalidEmail;
  required = ERROR_FORM.required;
  submitted = false;
  referralForm: FormGroup;
  referrals = [];
  fields = [ 'Fecha', 'Código', 'Cliente' ];
  user: User;
  paginate: Paginate;
  sponsorCode: string;
  balance: string;
  private _storeId: string;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private _clipboardService: ClipboardService
  ) {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    // tslint:disable-next-line: deprecation
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      if ( this.auth.getUserRol() === 'merchant' ) {
        this.store = store;
        this.getCode();
      }
    } );
  }

  ngOnInit(): void {
    this.user = this.auth.getUserActive();
    // this.getCode();
    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( params => {
      this._storeId = params.storeId;
      this.getCode();
    } );


  }
  get f() { return this.referralForm.controls; }

  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    // conexion con api de lista de referidos
  }

  callServiceToCopy(): void {
    this._clipboardService.copy( this.sponsorCode );

  }

  private getCode(): void {
    // tslint:disable-next-line: deprecation
    this.shopService.getAffiliate( this._storeId, this.user._id ).subscribe( response => {
      this.sponsorCode = response.sponsor_code;
      this.balance = `$${response.balance}`;

    } );
  }

}
