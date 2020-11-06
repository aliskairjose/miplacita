import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { FacebookLoginResponse } from 'src/app/shared/classes/facebook-login-response';
import { PlatformLocation } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  role = 'admin';
  url = '';
  title: string;
  mustReturn = false; // variable que indica que debe retornar al origen despues de login
  mustReturnStore = false; // variable que indica que debe retornar al origen despues de login

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private socialService: SocialAuthService,
    private platformLocation: PlatformLocation,

  ) {
    this.platformLocation.pushState( null, '', '/login' );
    this.createForm();
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe( params => {
      if ( Object.keys( params ).length !== 0 ) {
        this.role = params.role;
        this.url = params.url;
        if ( params.role === 'merchant' ) { this.title = 'como Vendedor'; }

        if ( params.role === 'client' ) { this.title = 'como Comprador'; }
        if ( params.status ) { this.mustReturn = true; }
        if ( params.url ) { this.mustReturnStore = true; }
      }
    } );

    this.socialService.authState.subscribe( ( response: FacebookLoginResponse ) => {
      const data = { fullname: '', token: '', email: '', role: '' };
      data.email = response.email;
      data.fullname = response.name;
      data.token = response.authToken;
      data.role = this.role;

      this.loginFB( data );
    } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginForm.value.role = this.role;

    if ( this.loginForm.valid ) {
      this.auth.login( this.loginForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          this.storage.setLoginData( 'data', data );
          this.auth.authSubject( data.success );

          // Redireccionamiento al dashboard
          this.redirectAfterLogin();
        }

      } );
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
      role: [ '' ],
    } );
  }

  loginFacebook(): void {
    this.socialService.signIn( FacebookLoginProvider.PROVIDER_ID );
  }

  private loginFB( data: any ): void {
    this.auth.socialLogin( data ).subscribe( ( result: AuthResponse ) => {
      if ( result.success ) {
        this.storage.setLoginData( 'data', result );
        this.auth.authSubject( result.success );
        this.redirectAfterLogin();

      }
    } );
  }

  private redirectAfterLogin(): void {
    ( this.mustReturn ) ? this.router.navigate( [ 'shop/checkout/shipping' ] ) : this.router.navigate( [ 'home' ] );
    if ( this.mustReturnStore ) { this.router.navigate( [ this.url ] ); }

  }

  passwordRecovery() {
    this.loginForm.value.role = this.role;
    this.loginForm.value.password_url = `${window.location.origin}/pages/password`;

    // Si no tiene email en el fomulario, informa con mensaje
    if ( !this.loginForm.value.email ) {
      this.toastrService.warning( 'Ingresa tu correo para recuperar tu contraseña' );
      return;
    }

    this.auth.passwordRecovery( this.loginForm.value ).subscribe( ( result ) => {
      if ( result.success ) {
        this.toastrService.info( 'Le enviamos un correo para iniciar el proceso de cambio de contraseña' );
      }
    } );

  }
}
