import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { environment } from '../../../../environments/environment.prod';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

const state = {
  user: JSON.parse( localStorage.user || null ),
};
@Component( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.scss' ]
} )
export class ProfileComponent implements OnInit {

  updateUserForm: FormGroup;
  submitted: boolean;
  minlength = 'Debe tener mínimo 8 caracteres';
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  matchError = environment.errorForm.matchError;
  onlyLetter = environment.errorForm.onlyLetter;
  user: User = {};

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toatsrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.user = state.user;
    this.createForm();
    this.spinner.show();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.updateUserForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    console.log( this.updateUserForm.value );

    if ( this.updateUserForm.valid ) {
      this.auth.updateUser( this.updateUserForm.value ).subscribe( response => {
        console.log( response );
        if ( response.success ) {
          this.toatsrService.info( response.message[ 0 ] );
          this.user = response.user;
          this.storage.setItem( 'user', this.user );
        }
      } );
    }
  }

  private createForm(): void {
    this.updateUserForm = this.formBuilder.group( {
      email: [ this.user ? this.user.email : '', [ Validators.required, Validators.email ] ],
      fullname: [ this.user ? this.user.fullname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      password: [ '', [] ],
      passwordConfirmation: [ '' ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }
}
