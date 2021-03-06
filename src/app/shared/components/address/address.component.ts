import { Component, OnInit, NgZone, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MapsAPILoader } from '@agm/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../classes/user';
import { ShippingAddress } from '../../classes/shipping-address';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';


@Component( {
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: [ './address.component.scss' ]
} )
export class AddressComponent implements OnInit {

  shippingAddress: ShippingAddress = {};
  addressForm: FormGroup;
  submitted: boolean;
  hideMessage = false;
  latitude = 8.9936;
  longitude = -79.51973;
  zoom: number;
  address: string;
  user: User = {};
  options = {
    types: []
  };
  config: '';

  @Input() isProfile = false;

  private _addressExist = false;
  private geoCoder;
  private _saveAddress: boolean;

  @ViewChild( 'placesRef' ) placesRef: GooglePlaceDirective;
  @ViewChild( 'placesRef' ) public searchElementRef: ElementRef;

  constructor(
    private ngZone: NgZone,
    public auth: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private confirmationDialogService: ConfirmationDialogService,

  ) {
    this.isProfile = false;
    if ( this.auth.isAuthenticated() ) {
      this.hideMessage = true;
      this.user = this.auth.getUserActive();
      this.userService.getUserAddress( this.user._id ).subscribe( address => {
        this._addressExist = true;

        if ( this.isProfile ) {
          if ( address.name ) {
            this.shippingAddress = { ...address };
          } else {
            const fullname = this.user.fullname.split( ' ' );
            const [ name, ...lastname ] = fullname;
            this.shippingAddress.name = name;
            this.shippingAddress.last_name = lastname.join( ' ' );
            this.shippingAddress.email = this.user.email;
          }
          this.createForm();
          return;
        }

        if ( address?.name ) {
          this.confirmationDialogService.confirm(
            'Direcci??n de env??o',
            `Ya existe una direcci??n, ??Desea usarla?`,
            'Si deseo usarla',
            'No gracias'
          ).then( ( confirmed: boolean ) => {
            if ( confirmed ) {
              this.shippingAddress = { ...address };
              this.addressForm.get( 'coord' ).setValue( this.shippingAddress.coord );
            } else {
              this.shippingAddress = {};
            }
            this.createForm();
          } );
        } else {
          const fullname = this.user.fullname.split( ' ' );
          const [ name, ...lastname ] = fullname;
          this.shippingAddress.name = name;
          this.shippingAddress.last_name = lastname.join( ' ' );
          this.shippingAddress.email = this.user.email;
        }
      } );
    }

    this.route.queryParams.subscribe( params => this.config = params.config );
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.addressForm.controls; }

  ngOnInit(): void {
    this.setCurrentLocation();
    this.mapsAPILoader.load().then( () => {
      // this.setCurrentLocation();
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
      reference: [ this.shippingAddress ? this.shippingAddress.reference : '' ],
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

  saveAddress( event ): void {
    this._saveAddress = event.target.checked;
  }

  onSubmit(): any {
    this.submitted = true;
    const shippingAddress = this.addressForm.value;
    if ( !shippingAddress.coord ) { shippingAddress.coord = this.shippingAddress.coord; }

    const data = {
      shippingAddress: this.addressForm.value,
      addressExist: this._addressExist,
      saveAddress: this._saveAddress
    };

    if ( this.addressForm.valid ) { return data; }
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

}
