import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class StorageService {

  constructor() { }

  /**
   * @description Almacena la data en el localStorage
   * @param key Identificador del valor a almacenar
   * @param value Valor a almacenar
   */
  set( key: string, value: any ) {
    localStorage.setItem( key, JSON.stringify( value ) );
  }

  /**
   * @description Recuerpa la data almacenada en el localStorage
   * @param key Identificador del dato que se desea recuperar
   */
  get( key: string ): Promise<{ value: any }> {
    const item = localStorage.getItem( key );
    return JSON.parse( item );
  }

  /**
   * @description Elimina la data almacenada según el identificador
   * @param key Identificador de la data que se desea eliminar
   */
  removeStorageItem( key: string ) {
    localStorage.remove( key );
  }

  /**
   * Elimina toda la data almacenada en el localStorage
   */
  clear() {
    localStorage.clear();
  }

}
