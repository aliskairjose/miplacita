import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '../../../shared/classes/store';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.prod';
import { ShopService } from '../../../shared/services/shop.service';

@Component( {
  selector: 'app-create-referrals',
  templateUrl: './create-referrals.component.html',
  styleUrls: [ './create-referrals.component.scss' ]
} )
export class CreateReferralsComponent implements OnInit, OnChanges {

  referralForm: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;

  @Input() store: Store;

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
    console.log( this.referralForm.value );
    this.submitted = true;
    if ( this.referralForm.valid ) {
      this.shopService.updateAffiliate( this.store._id, this.referralForm.value ).subscribe( store => {
        console.log( store );
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
