import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '../../../shared/classes/store';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-create-referrals',
  templateUrl: './create-referrals.component.html',
  styleUrls: [ './create-referrals.component.scss' ]
} )
export class CreateReferralsComponent implements OnInit, OnChanges {

  referralForm: FormGroup;
  submitted: boolean;

  @Input() store: Store;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
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

    }
  }

  private createForm(): void {
    this.referralForm = this.formBuilder.group( {

    } );
  }

}
