import { ToastrService } from 'ngx-toastr';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '../../../shared/classes/store';
import { ShopService } from '../../../shared/services/shop.service';

@Component( {
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: [ './shop-profile.component.scss' ]
} )
export class ShopProfileComponent implements OnInit, OnChanges {

  profileForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';
  plan: any = {};
  images: Array<string> = [];
  enabled = false;

  @Input() store: Store;

  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private toastrService: ToastrService,
  ) {
    this.createForm();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }


  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.profileForm.controls; }

  ngOnInit(): void {
    if ( this.store ) { this.enabled = true; }

  }

  onSubmit(): void {
    this.submitted = true;
    if ( this.profileForm.valid ) {
      this.shopService.updateStore( this.store._id, this.profileForm.value ).subscribe( response => {
        this.toastrService.info( 'Tienda actualizada con éxito' );
      } );
    }
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      // description: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ]
    } );
  }

  uploadImage( images: string[] ): void {
    this.images = [ ...images ];
  }

}
