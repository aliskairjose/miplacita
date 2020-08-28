import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component( {
  selector: 'app-shop-withdrawal',
  templateUrl: './shop-withdrawal.component.html',
  styleUrls: [ './shop-withdrawal.component.scss' ]
} )
export class ShopWithdrawalComponent implements OnInit {
  paymentDay = '31/12/2020';
  banks = [];
  form: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;

  constructor(
    private formBuilder: FormBuilder,

  ) { this.createForm(); }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.form.controls; }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.form.valid ) {

    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group( {
      bank: [ '', [ Validators.required ] ],
      account: [ '', [ Validators.required ] ],
      titular: [ '', [ Validators.required ] ],
      type: [ '', [ Validators.required ] ],
    } );
  }

}
