import { FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { FacebookLoginResponse } from '../../../shared/classes/facebook-login-response';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { PlatformLocation } from '@angular/common';

const state = { user: JSON.parse( sessionStorage.userForm || null ) };

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
  matchError = environment.errorForm.matchError;
  minlength = 'Debe tener mínimo 8 caracteres';
  onlyLetter = environment.errorForm.onlyLetter;
  user = {
    fullname: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };
  role = 'client';
  url = '';
  title: string;
  mustReturnStore = false;
  isPassword = true;
  isPasswordR = true;
  icon = 'fa fa-eye';
  icon2 = 'fa fa-eye';

  private emailPattern = environment.emailPattern;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private socialService: SocialAuthService,
    private platformLocation: PlatformLocation,
  ) {
    this.platformLocation.pushState( null, '', '/register' );
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( params => {
      if ( params.url ) {
        this.url = params.url;
        this.mustReturnStore = true;
      }

      if ( params.role ) {
        this.role = params.role;
        this.changeUser( params.role );
      }
    } );

    if ( state.user ) { this.registerSuccess = true; }
    // tslint:disable-next-line: deprecation
    this.socialService.authState.subscribe( ( response: FacebookLoginResponse ) => {
      const data = { fullname: '', token: '', email: '' };
      data.email = response.email;
      data.fullname = response.name;
      data.token = response.authToken;
      this.registerFB( data );
    } );
  }

  goLogin(): void {
    this.router.navigate( [ '/pages/login' ], { queryParams: { role: this.role } } );
  }


  listen( r: boolean ) {
    this.registerSuccess = false;
    this.user = JSON.parse( sessionStorage.userForm );
  }

  onSubmit() {
    this.submitted = true;
    this.registerForm.value.role = this.role;
    if ( this.registerForm.valid ) {
      // tslint:disable-next-line: deprecation
      this.auth.register( this.registerForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          this.storage.setItem( 'prelogin', this.registerForm.value );
          this.storage.setItem( 'userForm', data.user );
          this.storage.setItem( 'mp_token', data.token );
          if ( this.mustReturnStore ) {
            this.router.navigate( [ this.url ] );
            return;
          }
          if ( this.role === 'merchant' ) {
            this.registerSuccess = true;
          } else {
            // Opcion client
            this.router.navigate( [ '/pages/user/interests' ] );
          }
        }
      } );
    }
  }

  registerFacebook(): void {
    this.socialService.signIn( FacebookLoginProvider.PROVIDER_ID );
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group( {
      role: [ '' ],
      fullname: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z ]*' ) ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      passwordConfirmation: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

  private registerFB( data: any ): void {
    // tslint:disable-next-line: deprecation
    this.auth.socialLogin( data ).subscribe( ( result: AuthResponse ) => {
      if ( result.success ) {
        sessionStorage.setItem( 'userForm', JSON.stringify( result.user ) );
        this.registerSuccess = true;
      }
    } );
  }

  changeUser( typeUser: string ) {
    this.role = typeUser;
    if ( this.role === 'merchant' ) { this.title = 'y vende'; }

    if ( this.role === 'client' ) { this.title = 'y compra'; }
  }

  changeType( type: boolean ): void {
    this.isPassword = !type;
    this.icon = this.isPassword ? 'fa fa-eye' : 'fa fa-eye-slash';
  }
  changeTypeR( type: boolean ): void {
    this.isPasswordR = !type;
    this.icon2 = this.isPassword ? 'fa fa-eye' : 'fa fa-eye-slash';
  }

}
