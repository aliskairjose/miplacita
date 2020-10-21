import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Store } from '../../shared/classes/store';
import { environment } from 'src/environments/environment';

@Component( {
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: [ './support.component.scss' ]
} )
export class SupportComponent implements OnInit, OnChanges {

  @Input() store: Store;
  private _whatsAppUrl = `https://wa.me/${environment.whatsappContact}`;

  constructor(
  ) { }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  ngOnInit(): void {
  }

  sendWhatsApp(): void {
    window.open( this._whatsAppUrl, '_blank' );
  }

  private init(): void {

  }



}
