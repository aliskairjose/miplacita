import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../shared/services/auth.service';
import { StoreService } from '../../shared/services/store.service';
import { Store } from '../../shared/classes/store';
import { log } from 'console';

@Component( {
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: [ './shop-profile.component.scss' ]
} )
export class ShopProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';
  store: Store = {};
 
  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private spinner: NgxSpinnerService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.profileForm.controls; }

  ngOnInit(): void {
    this.spinner.show();
    const stores: Store[] = this.storage.getItem( 'stores' );
    this.storeService.getStore( stores[ 0 ]._id ).subscribe( ( store: Store[] ) => {
      this.spinner.hide();
      this.store = { ...store[ 0 ] };
      console.log( this.store );
    }, () => this.spinner.hide() );
  }

  onSubmit(): void {
    this.submitted = true;
    console.log( this.profileForm.value );
    /* if ( this.profileForm.valid ) {
      this.spinner.show();
      this.storeService.updateStore( this.store._id, this.profileForm.value ).subscribe( () => {
        this.spinner.hide();
        this.alert.info( 'La tienda se actualizó con exito' );
      }, ( response: HttpErrorResponse ) => {
        this.spinner.hide();
        this.alert.warning( response.error.message );
      } );
    } */
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ]
    } );
  }

}
