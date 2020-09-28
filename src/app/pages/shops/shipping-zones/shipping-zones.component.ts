import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../shared/services/shop.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component( {
  selector: 'app-shipping-zones',
  templateUrl: './shipping-zones.component.html',
  styleUrls: [ './shipping-zones.component.scss' ]
} )
export class ShippingZonesComponent implements OnInit {

  submitted: boolean;
  zonesForm: FormGroup;
  zones = [];
  allZones = [];
  fields = ['Zona', 'Precio',''];
  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,

  ) {
    this.createForm();
  }


  ngOnInit(): void {

  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.zonesForm.valid ) {
      this.shopService.addShipmetZone( this.zonesForm.value ).subscribe( response => {
        // Logica despues de crear zone
      } );
    }
  }

  private createForm(): void {
    this.zonesForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],
      store_id: [ '' ],
    } );
  }

}
