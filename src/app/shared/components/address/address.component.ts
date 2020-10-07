import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MapsAPILoader } from '@agm/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../classes/user';

export interface ShippingAddress {
  name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  userId?: string;
}
@Component( {
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: [ './address.component.scss' ]
} )
export class AddressComponent implements OnInit {

  shippingAddress: ShippingAddress;
  addressForm: FormGroup;
  submitted: boolean;
  hideMessage = false;
  latitude = 10.4683841;
  longitude = -66.9604066;
  zoom: number;
  address: string;
  user: User = {};
  options = {
    types: [],
    componentRestrictions: { country: 'PA' }
  };
  private geoCoder;

  @ViewChild( 'placesRef' ) placesRef: GooglePlaceDirective;
  @ViewChild( 'placesRef' ) public searchElementRef: ElementRef;

  constructor(
    private ngZone: NgZone,
    private auth: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private mapsAPILoader: MapsAPILoader,
  ) {
    this.createForm();

    if ( this.auth.isAuthenticated() ) {
      this.hideMessage = true;
      this.user = this.storage.getItem( 'user' );

      // this.userService.getUserAddress( this.user._id ).subscribe( response => {
      //   console.log( response );

      //   if ( response.success ) {
      //     // const response = confirm( 'Ya existe una dirección, ¿Desea usarla?' );
      //     // ( response ) ? this.shippingAddress = shippingAddress : this.shippingAddress = {};
      //   }
      // } );
      /* const store = this.user.stores[ 0 ];
      const shippingAddress: ShippingAddress = this.storage.getItem( `shippingAddress${this.user._id}` );

      if ( shippingAddress && ( shippingAddress.userId === this.user._id ) ) {
        const response = confirm( 'Ya existe una dirección, ¿Desea usarla?' );
        ( response ) ? this.shippingAddress = shippingAddress : this.shippingAddress = {};
      } */
    }
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.addressForm.controls; }

  ngOnInit(): void {
    this.setCurrentLocation();
    this.mapsAPILoader.load().then( () => {
      this.setCurrentLocation();
      // tslint:disable-next-line: new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete( this.searchElementRef.nativeElement );
      autocomplete.addListener( 'place_changed', () => {
        this.ngZone.run( () => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if ( place.geometry === undefined || place.geometry === null ) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        } );
      } );
    } );
  }

  createForm(): void {

    this.addressForm = this.formBuilder.group( {
      name: [ this.shippingAddress ? this.shippingAddress.name : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      last_name: [ this.shippingAddress ? this.shippingAddress.last_name : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ this.shippingAddress ? this.shippingAddress.phone : '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ this.shippingAddress ? this.shippingAddress.email : '', [ Validators.required, Validators.email ] ],
      address: [ this.shippingAddress ? this.shippingAddress.address : '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      reference: [ '' ],
      coord: [ '' ]
    } );
  }

  handleAddressChange( address: any ): void {
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.addressForm.value.address = address.formatted_address;
    this.addressForm.value.coord = [ this.latitude, this.longitude ];
  }

  markerDragEnd( $event ) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();

    this.getAddress( this.latitude, this.longitude );
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ( 'geolocation' in navigator ) {
      navigator.geolocation.getCurrentPosition( ( position ) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      } );
    }
  }

  private getAddress( latitude, longitude ) {
    this.geoCoder.geocode( { location: { lat: latitude, lng: longitude } }, ( results, status ) => {
      if ( status === 'OK' ) {
        if ( results[ 0 ] ) {
          this.zoom = 12;
          this.address = results[ 0 ].formatted_address;
          this.addressForm.value.address = this.address;
        } else {
          this.toastrService.warning( 'No results found' );
        }
      } else {
        this.toastrService.warning( `Geocoder failed due to: ${status}` );
      }

    } );
  }

  private addUserAddress(): void {
    this.userService.addUserAddress( this.user._id, this.addressForm.value ).subscribe( response => {
      console.log( response );
    } );
  }

}
