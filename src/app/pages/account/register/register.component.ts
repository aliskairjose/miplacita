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
  role: string;

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
    const role = this.route.queryParams.subscribe( params => {
      this.role = params.role;
    } );

    if ( state.user ) { this.registerSuccess = true; }
    this.socialService.authState.subscribe( ( response: FacebookLoginResponse ) => {
      const data = { fullname: '', token: '', email: '' };
      data.email = response.email;
      data.fullname = response.name;
      data.token = response.authToken;
      this.registerFB( data );
    } );
  }

  listen( r: boolean ) {
    this.registerSuccess = false;
    this.user = JSON.parse( sessionStorage.userForm );
  }

  onSubmit() {
    this.submitted = true;
    this.registerForm.value.role = this.role;

    if ( this.registerForm.valid ) {
      this.auth.register( this.registerForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          sessionStorage.setItem( 'userForm', JSON.stringify( data.user ) );
          this.storage.setItem( 'token', data.token );
          if ( this.role === 'merchant' ) {
            this.registerSuccess = true;
          } else {
            // Opcion client
            console.log("cliente")
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
      email: [ '', [ Validators.required, Validators.email ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

  private registerFB( data: any ): void {
    this.auth.socialLogin( data ).subscribe( ( result: AuthResponse ) => {
      if ( result.success ) {
        sessionStorage.setItem( 'userForm', JSON.stringify( result.user ) );
        this.registerSuccess = true;
      }
    } );
  }

}
