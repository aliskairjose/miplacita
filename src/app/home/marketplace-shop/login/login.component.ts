import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
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
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private socialService: SocialAuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.socialService.authState.subscribe( ( user ) => {
      console.log( user );
    } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if ( this.loginForm.valid ) {
      this.auth.login( this.loginForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          this.storage.setLoginData( 'data', data );
          this.auth.authSubject( data.success );

          // Redireccionamiento al dashboard
          // this.router.navigate( [ 'pages/dashboard' ] );
        }

      } );
    }
  }

  loginFacebook(): void {
    this.socialService.signIn( FacebookLoginProvider.PROVIDER_ID );
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
    } );
  }

}
