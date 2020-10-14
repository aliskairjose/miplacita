import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/helper/must-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { environment } from '../../../../environments/environment.prod';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressComponent } from '../../../shared/components/address/address.component';
import { ShippingAddress } from '../../../shared/classes/shipping-address';
import { UserService } from '../../../shared/services/user.service';

@Component( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.scss' ]
} )
export class ProfileComponent implements OnInit, AfterViewInit {

  updateUserForm: FormGroup;
  submitted: boolean;
  minlength = 'Debe tener mínimo 8 caracteres';
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  matchError = environment.errorForm.matchError;
  onlyLetter = environment.errorForm.onlyLetter;
  user: User = {};
  active = 'profile';
  isProfile = true;
  @ViewChild( 'address' ) address: AddressComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toatsrService: ToastrService,
  ) {

  }
  ngAfterViewInit(): void {
    this.isProfile = true;
  }

  ngOnInit(): void {
    this.user = this.auth.getUserActive();
    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      if ( this.active === 'profile' && url.length === 4 ) {
        this.active = 'address';
      }
    } );
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.updateUserForm.controls; }


  saveAddress(): void {
    const data = this.address.onSubmit();

    if ( data.addressExist ) {
      this.addUserAddress( data.shippingAddress );
    } else {
      this.updateUserAddress( data.shippingAddress );
    }
  }

  private addUserAddress( shippingAddress: ShippingAddress ): void {
    if ( shippingAddress ) {
      this.userService.addUserAddress( this.user._id, shippingAddress ).subscribe( response => {
        if ( response.success ) {
          this.toatsrService.info( response.message[ 0 ] );
        }
      } );
    }
  }

  private updateUserAddress( shippingAddress: ShippingAddress ): void {
    this.userService.updateUserAddress( this.user._id, shippingAddress ).subscribe( response => {
      if ( response.success ) {
        this.toatsrService.info( response.message[ 0 ] );
      }
    } );
  }

  onSubmit(): void {
    this.submitted = true;
    // Se elimina las validaciones si estan vacions Password y ConfirmPassword
    if ( !this.updateUserForm.value.password && !this.updateUserForm.value.passwordConfirmation ) {
      this.updateUserForm.controls.password.clearValidators();
      this.updateUserForm.controls.passwordConfirmation.clearValidators();
      this.updateUserForm.controls.password.updateValueAndValidity();
      this.updateUserForm.controls.passwordConfirmation.updateValueAndValidity();
    }

    if ( this.updateUserForm.valid ) {
      this.auth.updateUser( this.updateUserForm.value ).subscribe( response => {
        if ( response.success ) {
          this.toatsrService.info( response.message[ 0 ] );
          let user: User;
          user = { ...response.user };
          user.stores = this.user.stores;
          this.storage.setItem( 'user', user );
        }
      } );
    }
  }

  private createForm(): void {
    this.updateUserForm = this.formBuilder.group( {
      email: [ this.user ? this.user.email : '', [ Validators.required, Validators.email ] ],
      fullname: [ this.user ? this.user.fullname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      passwordConfirmation: [ '', Validators.required ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' )
    } );
  }

  updateTab( tab: string ) {
    this.active = tab;
    if ( this.active == 'profile' ) {
      this.router.navigateByUrl( `pages/account/user/${tab}`, { skipLocationChange: false } );

    } else {
      this.router.navigateByUrl( `pages/account/user/profile/${tab}`, { skipLocationChange: false } );

    }

  }
}
