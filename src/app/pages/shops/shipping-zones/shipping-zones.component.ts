import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShopService } from '../../../shared/services/shop.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Store } from '../../../shared/classes/store';
import { ShipmentOption } from '../../../shared/classes/shipment-option';

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

  @Input() store: Store;

  constructor(
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,

  ) {
    this.createForm();
  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }


  ngOnInit(): void {
    const user: User = this.storage.getItem( 'user' );
    this.zonesForm.value.store_id = this.store._id;
    this.loadShippingZones();
  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.zonesForm.valid ) {
      this.shopService.addShipmetZone( this.zonesForm.value ).subscribe( response => {
        // Logica despues de crear zone
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
