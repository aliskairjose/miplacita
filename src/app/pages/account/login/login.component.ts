import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { HttpErrorResponse } from '@angular/common/http';

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
      this.auth.login( this.loginForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          this.storage.setItem( 'token', data.token );
          this.storage.setItem( 'role', data.user.role );
          this.storage.setItem( 'user', data.user );
          this.storage.setItem( 'stores', data.user.stores );

          this.auth.authSubject( data.success );

          // Redireccionamiento al dashboard
          this.router.navigate( [ 'pages/dashboard' ] );
        }

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
