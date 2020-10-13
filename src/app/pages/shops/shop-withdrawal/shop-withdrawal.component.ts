import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { default as banks } from '../../../../assets/data/banks.json';
import { ShopService } from '../../../shared/services/shop.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { Store } from '../../../shared/classes/store';

@Component( {
  selector: 'app-shop-withdrawal',
  templateUrl: './shop-withdrawal.component.html',
  styleUrls: [ './shop-withdrawal.component.scss' ]
} )
export class ShopWithdrawalComponent implements OnInit, OnChanges {
  paymentDay = '31/12/2020';
  banks = banks.banks;
  form: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;
  storeId = '';
  amount = 0;

  @Input() store: Store;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private toastrService: ToastrService,

  ) { this.createForm(); }

  ngOnChanges( changes: SimpleChanges ): void {
    this.loadDebs();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.form.controls; }

  ngOnInit(): void {
    const user: User = this.auth.getUserActive();
    if ( user.stores.length ) { this.storeId = user.stores[ 0 ]._id; }
  }

  onSubmit(): void {
    this.submitted = true;
    if ( this.form.valid ) {
      this.shopService.withdrawals( this.form.value, this.storeId ).subscribe( response => {
        if ( response.success ) {
          this.toastrService.info( response.message[ 0 ] );
          this.loadDebs();
        }
        this.form.reset();
      } );
    }
  }

  private loadDebs(): void {
    this.shopService.getDebts( this.store._id ).subscribe( amount => this.amount = amount );
  }

  private createForm(): void {
    this.form = this.formBuilder.group( {
      bank: [ '', [ Validators.required ] ],
      account: [ '', [ Validators.required ] ],
      name_holder: [ '', [ Validators.required ] ],
      type: [ '', [ Validators.required ] ],
    } );
  }

}
