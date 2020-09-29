import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Plan } from '../classes/plan';
import { map } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Consulta la información del usuario por ID
   * @param id Id del usuario a consultar
   */
  getUser( id: string ): Observable<any> {
    return this.http.get( `users/${id}` );
  }

}
