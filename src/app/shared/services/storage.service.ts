import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class StorageService {

  constructor() { }


  setLoginData(key: string, value: any): void {
    localStorage.setItem( 'user', JSON.stringify( value.user ) );
    localStorage.setItem( 'token', JSON.stringify( value.token ) );
  }

  /**
   * @description Almacena la data en el localStorage
   * @param key Identificador del valor a almacenar
   * @param value Valor a almacenar
   */
  setItem( key: string, value: any ): void {
    localStorage.setItem( key, JSON.stringify( value ) );
  }

  /**
   * @description Recuerpa la data almacenada en el localStorage
   * @param key Identificador del dato que se desea recuperar
   * @returns value { any }
   */
  getItem( key: string ): any {
    const value = localStorage.getItem( key );
    return JSON.parse( value );
  }

  /**
   * @description Elimina la data almacenada según el identificador
   * @param key Identificador de la data que se desea eliminar
   */
  removeItem( key: string ): void {
    localStorage.removeItem( key );
  }

  /**
   * @description Elimina toda la data almacenada en el localStorage
   */
  clearAll(): void {
    localStorage.clear();
  }

}
