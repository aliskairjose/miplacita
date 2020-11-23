import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '../../../shared/classes/store';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.prod';
import { ShopService } from '../../../shared/services/shop.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component( {
  selector: 'app-create-referrals',
  templateUrl: './create-referrals.component.html',
  styleUrls: [ './create-referrals.component.scss' ]
} )
export class CreateReferralsComponent implements OnInit, OnChanges {

  referralForm: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;

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
    console.log( this.store )
  }

  ngOnInit(): void {
  }

  get f() { return this.referralForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if ( this.referralForm.valid ) {
      this.shopService.updateAffiliate( this.store._id, this.referralForm.value ).subscribe( store => {
        console.log( store );
        store.affiliate_program_amount = this.referralForm.value.affiliate_program_amount;
        this.toastr.info( 'Información actualizada con exito' );
        // this.referralForm.reset();
        this.submitted = false;
        // this.store = store;
        this.updateShop.emit( store );
      } );
    }
  }

  private createForm(): void {
    this.referralForm = this.formBuilder.group( {
      affiliate_program_amount: [ '', [ Validators.required ] ],
      affiliate_program: [ '', [ Validators.required ] ]
    } );
  }

}
