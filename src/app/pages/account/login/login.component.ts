import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    console.log(this.loginForm.valid)
    this.submitted = true;

    if ( this.loginForm.valid ) {
      // this.spinner.show();
      this.authService.login( this.loginForm.value ).subscribe( response => {
        console.log( response );
        this.spinner.hide();
      }, () => this.spinner.hide() );
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
    } );
  }

}
