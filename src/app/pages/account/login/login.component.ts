import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage.service';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
} )
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';

  constructor(
    private router: Router,
    private alert: AlertService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if ( this.loginForm.valid ) {
      this.spinner.show();
      this.auth.login( this.loginForm.value ).subscribe( response => {

        console.log( response );
        this.spinner.hide();

      }, ( error: HttpErrorResponse ) => {

        this.spinner.hide();
        // this.alert.warning( error.statusText );

      } );
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
    } );
  }

}
