import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShopService } from '../../../shared/services/shop.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from '../../../shared/classes/store';
import { ShipmentOption } from '../../../shared/classes/shipment-option';
import { environment } from '../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-shipping-zones',
  templateUrl: './shipping-zones.component.html',
  styleUrls: [ './shipping-zones.component.scss' ]
} )
export class ShippingZonesComponent implements OnInit, OnChanges {

  submitted: boolean;
  zonesForm: FormGroup;
  zones = [];
  allZones: ShipmentOption[] = [];
  fields = [ 'Zona', 'Precio', '' ];
  paginate: Paginate;
  required = environment.errorForm.required;

  @Input() store: Store;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,

  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.zonesForm.controls; }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.loadShippingZones();
  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;
    this.zonesForm.value.store_id = this.store._id;

    if ( this.zonesForm.valid ) {
      this.shopService.addShipmetZone( { shipment_options: this.zonesForm.value } ).subscribe( shipmentZone => {
        // Logica despues de crear zone
        // this.loadShippingZones();
        this.toastr.info( 'Se ha creado una nueva zona de envío' );
        this.allZones.push( shipmentZone );

      } );
    }
  }

  private loadShippingZones(): void {
    this.shopService.findShipmentOptionByShop( this.store._id ).subscribe( shipments => {
      this.allZones = [ ...shipments ];
    } );
  }

  private createForm(): void {
    this.zonesForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      store_id: [ '' ],
    } );
  }

  setPage( page: number ) {
    //this.loadData( page );
  }

}
