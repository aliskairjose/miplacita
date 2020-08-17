import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { NgxSpinnerService } from 'ngx-spinner';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {
  registerSuccess = false;
  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  matchError = 'Los campos deben coincidir';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {
    /** spinner starts on init */

    setTimeout( () => {
      /** spinner ends after 5 seconds */
    }, 2000 );
  }

  onSubmit() {
    this.submitted = true;
    this.spinner.show();

    if ( this.registerForm.valid ) {
      this.auth.register( this.registerForm.value ).subscribe( response => {
        console.log( response );
        this.spinner.hide();
        this.alert.info( 'Su registro se completo con exito' );
        setTimeout( () => {
          // Redireccionamiento despues del registro
        }, 3200 );
      }, ( error ) => {
        this.spinner.hide();
        this.alert.danger( 'Ha ocurrido un error!' )
      } );
    }
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
      confirmPassword: [ '', Validators.required ]
    }, {
      validator: MustMatch( 'password', 'confirmPassword' )
    } );
  }

}
