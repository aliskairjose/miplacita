import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from 'ngx-alerts';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthResponse } from '../../../shared/classes/auth-response';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage.service';

@Component( {
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterComponent implements OnInit {
  registerSuccess = false;
  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';
  matchError = 'Los campos deben coincidir';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    if ( this.registerForm.valid ) {
      this.spinner.show();
      this.auth.register( this.registerForm.value ).subscribe( ( data: AuthResponse ) => {
        console.log( data );
        if ( data.success ) {
          this.auth.selectedUSer = data.user;
          this.storage.setItem( 'token', data.token );
          this.storage.setItem( 'userId', data.user._id );
          this.spinner.hide();
          this.registerSuccess = true;
        }
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.danger( 'Ha ocurrido un error!' );
      } );
    }
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group( {
      role: [ 'merchant' ],
      fullname: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      passwordConfirmation: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

}
