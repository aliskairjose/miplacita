import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ShopService } from '../../../shared/services/shop.service';
import { Store } from '../../../shared/classes/store';
import { Result } from '../../../shared/classes/response';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { Plan } from '../../../shared/classes/plan';

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
  plan: any = {};
  images: Array<string> = [];
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private toastrService: ToastrService,
    private storageService: StorageService,
  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.profileForm.controls; }

  ngOnInit(): void {
    const user: User = this.storageService.getItem( 'user' );
    const stores: Store[] = user.stores;

    this.shopService.getStore( stores[ 0 ]._id ).subscribe( ( response: Result<Store> ) => {
      this.store = { ...response.docs[ 0 ] };
      this.plan = this.store.plan;
    } );
  }

  onSubmit(): void {
    this.submitted = true;
    console.log( this.profileForm.value );
     if ( this.profileForm.valid ) {
      this.shopService.updateStore( this.store._id, this.profileForm.value ).subscribe( () => {
        this.alert.info( 'La tienda se actualizó con exito' );
      } );
    } 
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ]
    } );
  }

  uploadImage( images: string[] ): void {
    this.images = [ ...images ];
  }

}
