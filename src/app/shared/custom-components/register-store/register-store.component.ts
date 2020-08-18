import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: [ './register-store.component.scss' ]
} )
export class RegisterStoreComponent implements OnInit {
  planSelected = 2;
  step = 1;
  categories = [];
  imageLogo: any;
  imageProduct: any;
  registerForm: FormGroup;
  submitted: boolean;
  invalidEmail = 'Email inválido';
  required = 'Campo obligatorio';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
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

  onSubmit(): void {
    this.submitted = true;

    if ( this.registerForm.valid ) {

    }
  }

  updatePlan( plan: number ) {
    this.planSelected = plan;
  }

  storeRegister() {
    //consumo de api
    // si el registro de la tienda fue exitoso
    this.step = 2;
  }

  productRegister() {
    //consumo de api
  }

  updateImage( $event ) {
    if ( $event.target.files.length == 0 ) {
      return;
    }

    const image = $event.target.files[ 0 ];
    const mimeType = image.type;
    if ( mimeType.match( /image\/*/ ) == null ) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( image );
    reader.onload = ( _event ) => {
      if ( this.step == 1 ) {
        this.imageLogo = reader.result;
      } else if ( this.step == 2 ) {
        this.imageProduct = reader.result;
      }
    }

  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group( {
      url: [ '', [ Validators.required ] ],
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
    } );
  }

}
