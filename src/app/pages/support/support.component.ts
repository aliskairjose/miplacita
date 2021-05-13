import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Store } from '../../shared/classes/store';
import { WHATSAPP_CONTACT } from 'src/app/shared/classes/global-constants';

@Component( {
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: [ './support.component.scss' ]
} )
export class SupportComponent implements OnInit, OnChanges {

  @Input() store: Store;
  private _whatsAppUrl = `https://wa.me/${WHATSAPP_CONTACT}`;

  constructor(
  ) { }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }

  ngOnInit(): void {
  }

  sendWhatsApp(): void {
    window.open( this._whatsAppUrl, '_blank' );
  }

}
