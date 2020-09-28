import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable( {
  providedIn: 'root'
} )
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor( private router: Router ) {
    router.events.subscribe( event => {
      if ( event instanceof NavigationEnd ) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    } );
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }
}
