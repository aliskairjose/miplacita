import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { environment } from '../../../../environments/environment.prod';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../shared/services/storage.service';

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
    private toatsrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.user = this.storage.getItem( 'user' );
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.updateUserForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    // Se elimina las validaciones si estan vacions Password y ConfirmPassword
    if ( !this.updateUserForm.value.password && !this.updateUserForm.value.passwordConfirmation ) {
      this.updateUserForm.controls.password.clearValidators();
      this.updateUserForm.controls.passwordConfirmation.clearValidators();
      this.updateUserForm.controls.password.updateValueAndValidity();
      this.updateUserForm.controls.passwordConfirmation.updateValueAndValidity();
    }

    if ( this.updateUserForm.valid ) {
      this.auth.updateUser( this.updateUserForm.value ).subscribe( response => {
        if ( response.success ) {
          this.toatsrService.info( response.message[ 0 ] );
          let user: User;
          user = { ...response.user };
          user.stores = this.user.stores;
          this.storage.setItem( 'user', user );
        }
      } );
    }
  }

  private createForm(): void {
    this.updateUserForm = this.formBuilder.group( {
      email: [ this.user ? this.user.email : '', [ Validators.required, Validators.email ] ],
      fullname: [ this.user ? this.user.fullname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      passwordConfirmation: [ '', Validators.required ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }
}
