import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Commission } from '../../shared/classes/commissions';
import { CommissionService } from '../../shared/services/commission.service';
import { ERROR_FORM } from '../../shared/classes/global-constants';

@Component( {
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: [ './commissions.component.scss' ]
} )
export class CommissionsComponent implements OnInit, OnChanges {


  commissionsForm: FormGroup;
  submitted: boolean;
  required = ERROR_FORM.required;
  commission: Commission = {};

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private commissionService: CommissionService,
  ) {
    this.createForm();
    this.commissionService.getCommission().subscribe( commission => this.commission = commission );

  }

  ngOnChanges( changes: SimpleChanges ): void {

  }

  ngOnInit(): void {
  }

  get f() { return this.commissionsForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if ( this.commissionsForm.valid ) {
      this.commissionService.updateCommission( this.commission._id, this.commissionsForm.value ).subscribe( response => {
        if ( response.success ) {
          this.toastr.info( response.message[ 0 ] );
          this.commission = response.commissions;
        }
      } );
    }
  }


  private createForm(): void {
    this.commissionsForm = this.formBuilder.group( {
      marketplace_commission: [ '', [ Validators.required ] ],
      store_commission: [ '', [ Validators.required ] ],
      payment_gateway_commission: [ '', [ Validators.required ] ]
    } );
  }

}
