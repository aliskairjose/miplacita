import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { environment } from '../../../../environments/environment.prod';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { FacebookLoginResponse } from '../../../shared/classes/facebook-login-response';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  matchError = environment.errorForm.matchError;
  onlyLetter = environment.errorForm.onlyLetter;
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

}
