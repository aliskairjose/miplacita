import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Observer } from 'rxjs';
import { User } from '../classes/user';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../classes/auth-response';
import { Store } from '../classes/store';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor(
    private http: HttpService
  ) { }


  userInvited(): Observable<AuthResponse> {
    return this.http.post( `users/invited` );
  }

  /**
   * @description Muetsra el rol del usuario
   * @returns El rol del usuario activo
   */
  getUserRol(): string {
    const user: User = JSON.parse( localStorage.getItem( 'mp_user' ) );
    if ( user ) {
      return user.role;
    } else {
      return '';
    }
  }

  /**
   * @description Muestra los datos del usuario activo
   * @returns Usuario
   */
  getUserActive(): User {
    const user = JSON.parse( localStorage.getItem( 'mp_user' ) );
    return user;
  }


  /**
   * @description Consulta la información del usuario por ID
   * @param id Id del usuario a consultar
   */
  getUser( id: string ): Observable<any> {
    return this.http.get( `users/${id}` );
  }

  /**
   * @description Actualización de la perfil del usuario
   * @param data Data del usuario que actualiza
   */
  updateUser( data: any ): Observable<any> {
    return this.http.put( `users`, data );
  }

  /*
    ---------------------------------------------
    ---------------  User Address  --------------
    ---------------------------------------------
  */

  /**
   * @description Muestra la dirección del usuario
   * @param id Id del usuario
   */
  getUserAddress( id: string ): Observable<any> {
    return this.http.get( `users/direction/${id}` );
  }

  /**
   * @description Agrega una dirección a usuario
   * @param id Id del usuario
   * @param data Dirección del usuario
   */
  addUserAddress( id: string, data: any ): Observable<any> {
    return this.http.post( `users/${id}/direction`, data );
  }

  /**
   * @description Actualiza la dirección de usuario
   * @param id Id del usuario
   * @param data Dirección a actualizar
   */
  updateUserAddress( id: string, data: any ): Observable<any> {
    return this.http.put( `users/${id}/direction`, data );
  }

  /*
   ---------------------------------------------
   ---------------  User Interest --------------
   ---------------------------------------------
  */

  /**
   * @description Muestra los intereses del usuario
   * @param id Id del usuario
   */
  getUserInterest( id: string ): Observable<any> {
    return this.http.get( `users/interest/${id}` );
  }

  /**
   * @description Agrega Interese del usuario
   * @param id Id del usuario
   * @param data Intereses del usuario
   */
  addUserInterest( id: string, data: any ): Observable<any> {
    return this.http.post( `users/${id}/config`, data );
  }

  /**
   * @description Actualiza los intereses del usuario
   * @param id Id del usuario
   * @param data Intereses a actualizar
   */
  updateUserInterest( id: string, data: any ): Observable<any> {
    return this.http.put( `users/${id}/config`, data );
  }


  /*
   ---------------------------------------------
   ---------------  Referidos  -----------------
   ---------------------------------------------
  */

  getReferred(): Observable<any> {
    return this.http.get( `endpoint` );
  }

  /**
   * @description Genera el codigo de afiliado
   * @param storeId Id de la tienda
   * @param userId Id del usuario
   */
  generateAffiliateCode( storeId: string, userId: string ): Observable<any> {
    return this.http.get( `users/affiliate//program?store=${storeId}&user=${userId}` );
  }

  /*
   ---------------------------------------------
   ---------------  UserStores  -----------------
   ---------------------------------------------
  */

  myStores(): Observable<Store[]> {
    return this.http.get( `users/mystores/registered?user=${this.getUserActive()._id}` ).pipe(
      map( res => {
        const stores: Store[] = [];
        res.result.forEach( ( res: any ) => stores.push( res.store_data[ 0 ] ) );
        return stores;
      } )
    );
  }

}
