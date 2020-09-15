import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { RegisterStoreComponent } from '../../../shared/custom-components/register-store/register-store.component';
import { environment } from '../../../../environments/environment';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FacebookLoginResponse } from '../../../shared/classes/facebook-login-response';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { StorageService } from 'src/app/shared/services/storage.service';

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

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private socialService: SocialAuthService

  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {
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
    if ( this.registerForm.valid ) {
      this.auth.register( this.registerForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          sessionStorage.setItem( 'userForm', JSON.stringify( data.user ) );
          this.storage.setItem( 'token', data.token );
          this.registerSuccess = true;
        }
      } );
    }
  }

  registerFacebook(): void {
    this.socialService.signIn( FacebookLoginProvider.PROVIDER_ID );
  }

  private createForm(): void {

    this.registerForm = this.formBuilder.group( {
      role: [ 'merchant' ],
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
      console.log( result );

      if ( result.success ) {
        sessionStorage.setItem( 'userForm', JSON.stringify( result.user ) );
        this.registerSuccess = true;
      }
    } );
  }

}
