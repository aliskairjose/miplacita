import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '../../../shared/classes/store';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../../../shared/services/shop.service';
import { ERROR_FORM } from '../../../shared/classes/global-constants';

@Component( {
  selector: 'app-create-referrals',
  templateUrl: './create-referrals.component.html',
  styleUrls: [ './create-referrals.component.scss' ]
} )
export class CreateReferralsComponent implements OnInit, OnChanges {

  referralForm: FormGroup;
  submitted: boolean;
  required = ERROR_FORM.required;
  amount = 0;
  @Input() store: Store = {};
  @Output() updateShop: EventEmitter<Store> = new EventEmitter<Store>();

  constructor(
    private toastr: ToastrService,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit(): void {
  }

  get f() { return this.referralForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if ( this.referralForm.valid ) {

      this.shopService.updateAffiliate( this.store._id, this.referralForm.value ).subscribe( store => {
        this.toastr.info( 'Información actualizada con exito' );
        this.submitted = false;
        this.updateShop.emit( store );
      } );
    }
  }

  private createForm(): void {
    this.referralForm = this.formBuilder.group( {
      amount: [ '', [ Validators.required ] ],
      affiliate_program: [ '', [ Validators.required ] ]
    } );
  }

}
