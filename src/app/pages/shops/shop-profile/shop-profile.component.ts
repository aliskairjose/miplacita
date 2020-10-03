import { ToastrService } from 'ngx-toastr';

import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
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
  @Output() updateShop: EventEmitter<Store> = new EventEmitter<Store>();

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
    this.profileForm.value.logo = this.store.logo;

    if ( this.profileForm.valid ) {
      this.shopService.updateStore( this.store._id, this.profileForm.value ).subscribe( response => {
        if ( response.success ) {
          this.store = { ...response.store };
          this.toastrService.info( response.message[ 0 ] );
          this.updateShop.emit( this.store );
        }
      } );
    }
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      url_store: [ '', [ Validators.required ] ],
      logo: [ '' ]
    } );
  }

  uploadImage( images: string[] ): void {
    this.images = [ ...images ];
  }

}
