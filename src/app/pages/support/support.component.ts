import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Store } from '../../shared/classes/store';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component( {
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: [ './support.component.scss' ]
} )
export class SupportComponent implements OnInit, OnChanges {

  @Input() store: Store;
  url: string = 'https://api.whatsapp.com/send?phone=' + environment.whatsappContact + '&text=';
  constructor( private router: Router) { }
  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  ngOnInit(): void {
  }

  private init(): void {

  }


}
