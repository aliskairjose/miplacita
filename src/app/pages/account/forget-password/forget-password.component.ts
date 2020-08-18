import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: [ './forget-password.component.scss' ]
} )
export class ForgetPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { this.createForm(); }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.forgotForm.controls; }


  onSubmit(): void {
    this.submitted = true;

    if ( this.forgotForm.valid ) {
      this.spinner.show();
      this.auth.resetPassword( this.forgotForm.value ).subscribe( () => {
        this.spinner.hide();
        this.alert.info( 'Le hemos enviado un correo, revise su buzón! Gracias' );
        setTimeout( () => {
          this.router.navigate( [ 'pages/login' ] );
        }, 3200 );
      }, () => {
        this.spinner.hide();
        this.alert.danger( 'Error' );
      } );
    }
  }

  createForm(): void {
    this.forgotForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
    } );
  }
}
