import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { Subject } from 'rxjs';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {
  $register: Subject<boolean> = new Subject<boolean>();

  registerSuccess = false;
  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  matchError = 'Los campos deben coincidir';
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
    console.log( 'register init' );

  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {

    console.log( 'register init' );
  }

  onSubmit() {
    this.submitted = true;

    if ( this.registerForm.valid ) {
      sessionStorage.setItem( 'userForm', JSON.stringify( this.registerForm.value ) );
      this.registerSuccess = true;
    }
  }

  return( event: boolean ): void {
    this.registerSuccess = event;
    this.user = JSON.parse( sessionStorage.userForm );
    console.log( this.user );
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group( {
      role: [ 'merchant' ],
      fullname: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      passwordConfirmation: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

}
