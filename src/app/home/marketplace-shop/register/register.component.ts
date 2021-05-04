import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { FacebookLoginResponse } from '../../../shared/classes/facebook-login-response';
import { ERROR_FORM } from '../../../shared/classes/global-constants';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = ERROR_FORM.invalidEmail;
  required = ERROR_FORM.required;
  matchError = ERROR_FORM.matchError;
  onlyLetter = ERROR_FORM.onlyLetter;
  minlength = 'Debe tener mínimo 8 caracteres';

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private socialService: SocialAuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    this.socialService.authState.subscribe( ( response: FacebookLoginResponse ) => {
      const data = { fullname: '', token: '', email: '' };
      data.email = response.email;
      data.fullname = response.name;
      data.token = response.authToken;
      this.registerFB( data );
    } );
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if ( this.registerForm.valid ) {

      this.auth.login( this.registerForm.value ).subscribe( ( data: AuthResponse ) => {
        if ( data.success ) {
          // Redireccionamiento al dashboard
          // this.router.navigate( [ 'pages/dashboard' ] );
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
      if ( result.success ) {
        sessionStorage.setItem( 'userForm', JSON.stringify( result.user ) );
      }
    } );
  }

}
