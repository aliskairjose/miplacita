import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { FacebookLoginResponse } from 'src/app/shared/classes/facebook-login-response';
import { ToastrService } from 'ngx-toastr';
import { ERROR_FORM, EMAIL_PATTERN } from '../../../shared/classes/global-constants';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
} )
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean;
  required = ERROR_FORM.required;
  invalidEmail = ERROR_FORM.invalidEmail;
  role = 'client';
  url = '';
  isPassword = true;
  icon = 'fa fa-eye';
  title = 'como Comprador';
  mustReturn = false; // variable que indica que debe retornar al origen despues de login
  mustReturnStore = false; // variable que indica que debe retornar al origen despues de login
  private emailPattern = EMAIL_PATTERN;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private socialService: SocialAuthService,

  ) {
    // this.platformLocation.pushState( null, '', '/login' );
    this.createForm();
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe( params => {
      this.role = params?.role;

      if ( Object.keys( params ).length !== 0 ) {
        this.url = params.url;
        this.changeUser();
        if ( params.status ) { this.mustReturn = true; }
        if ( params.url ) { this.mustReturnStore = true; }
      }
    } );

    this.route.url.subscribe( ( url ) => {
      if ( url[ 0 ].path === 'admin' ) {
        this.role = 'admin';
      }
    } );


    this.socialService.authState.subscribe( ( response: FacebookLoginResponse ) => {
      const data = { fullname: '', token: '', email: '', role: '' };
      data.email = response.email;
      data.fullname = response.name;
      data.token = response.authToken;
      data.role = this.role;
      this.storage.setItem( 'FB_LOGIN', true );
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
          this.toastrService.info( `Bienvenido ${data.user.fullname}` );
          this.storage.setItem( 'FB_LOGIN', false );
          // Redireccionamiento al dashboard
          this.redirectAfterLogin();
        }
      } );
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
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
    if ( this.mustReturn ) {
      this.router.navigate( [ 'shop/checkout/shipping' ] );
      return;
    }
    if ( this.mustReturnStore ) {
      this.router.navigate( [ this.url ] );
      return;
    }

    ( this.role === 'client' ) ? this.router.navigate( [ 'home' ] ) : this.router.navigate( [ 'pages/account/user/profile' ] );

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

  changeUser() {
    if ( this.role === 'merchant' ) { this.title = 'como vendedor'; }
    if ( this.role === 'client' ) { this.title = 'como comprador'; }
  }
}
