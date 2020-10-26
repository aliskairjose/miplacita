import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Plan } from '../classes/plan';
import { map } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class PlanService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Crea un nuevo plan
   * @param data Data de tipo plan a crear
   */
  addPlan( data: Plan ): Observable<any> {
    return this.http.post( `plan`, data );
  }

  /**
   * @description Actualiza los datos del plan
   * @param id Id del plan a actualizar
   * @param data Data a actualizar del plan
   */
  updatePlan( id: string, data: Plan ): Observable<any> {
    return this.http.put( `plan/${id}`, data );
  }

  /**
   * @description Elimina un plan existente
   * @param id Id del plan a eliminar
   */
  deletePlan( id: string ): Observable<any> {
    return this.http.delete( `plan/${id}` );
  }

  /**
   * @description Obtiene una lista de planes existentes
   */
  getPlans(): Observable<Plan[]> {
    return this.http.get( 'plan' ).pipe(
      map( response => {
        if ( response.success ) { return response.planes; }
      } )
    );
  }

  /**
   * @description Actualizacion de precios de planes
   * @param Id Id del plan a actualizar
   * @returns String Mensaje
   */
  updatePlanPrice( id: string ): Observable<string> {
    return this.http.put( `api/plan/${id}` ).pipe(
      map( response => {
        if ( response.success ) { return response.message; }
      } )
    );
  }

}
