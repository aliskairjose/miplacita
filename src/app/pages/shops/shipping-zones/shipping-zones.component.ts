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
  zone: ShipmentOption = {};
  state = 'add';
  buttonTitle = 'Crear zona';

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
      if ( this.state === 'add' ) {
        this.createShipmentZone();
      }
      if ( this.state === 'edit' ) {
        this.updateShipmentZone();
      }
    }
  }

  /**
   * * Edita la zona de envio seleccionada
   */
  editZone( zone: ShipmentOption ): void {
    this.state = 'edit';
    this.buttonTitle = 'Editar zona';
    this.zone = { ...zone };
  }

  deleteZone( id: string ): void {
    this.shopService.deleteShipmentOptions( id ).subscribe( () => {
      this.toastr.info( 'Ha eliminado la zona de envio' );
      this.loadShippingZones();
    } );
  }

  private createShipmentZone(): void {
    this.shopService.addShipmetZone( { shipment_options: this.zonesForm.value } ).subscribe( shipmentZone => {
      this.toastr.info( 'Se ha creado una nueva zona de envío' );
      this.allZones.push( shipmentZone );
      this.zone = {};

    } );
  }

  private updateShipmentZone(): void {
    this.shopService.updateShipmetOptions( this.zone._id, { shipment_options: this.zone } ).subscribe( () => {
      this.toastr.info( 'Se ha actualizado una nueva zona de envío' );
      this.state = 'add';
      this.buttonTitle = 'Crear zona';
      this.zone = {};
      this.zonesForm.reset();
      this.submitted = false;
      this.loadShippingZones();
    } );
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
