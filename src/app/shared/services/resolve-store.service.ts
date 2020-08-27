import { Store } from '../classes/store';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable( {
  providedIn: 'root'
} )

export class ResolveStore implements Resolve<Store> {

  store: Store = {};

  constructor(
    public storeService: StoreService
  ) { }

  async resolve( route: ActivatedRouteSnapshot ): Promise<any> {
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    this.storeService.getStore( route.params.slug ).subscribe( ( store: Store[] ) => {
      this.store = { ...store[ 0 ] };
    } );
    return this.store;
  }
}