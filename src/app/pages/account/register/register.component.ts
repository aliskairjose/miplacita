import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { RegisterStoreComponent } from '../../../shared/custom-components/register-store/register-store.component';
import { environment } from '../../../../environments/environment';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {
  registerSuccess = false;
  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  matchError = environment.errorForm.required;
  minlength = 'Debe tener mínimo 8 caracteres';
  onlyLetter = environment.errorForm.onlyLetter;
  user = {
    fullname: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void { }

  listen( r: boolean ) {
    this.registerSuccess = false;
    this.user = JSON.parse( sessionStorage.userForm );

  }

  onSubmit() {
    this.submitted = true;
    console.log( this.registerForm.valid )
    console.log( this.registerForm )
    if ( this.registerForm.valid ) {
      sessionStorage.setItem( 'userForm', JSON.stringify( this.registerForm.value ) );
      this.registerSuccess = true;
    }
  }

  private createForm(): void {
    const reg = '\[a-zA-Z\]';

    this.registerForm = this.formBuilder.group( {
      role: [ 'merchant' ],
      fullname: [ '', [ Validators.required, Validators.pattern( reg ) ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      passwordConfirmation: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

}
