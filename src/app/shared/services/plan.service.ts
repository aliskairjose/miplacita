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

  addPlan( data: Plan ): Observable<any> {
    return this.http.post( `plan`, data );
  }

  updatePlan( id: string, data: Plan ): Observable<any> {
    return this.http.put( `plan/${id}`, data );
  }

  deletePlan( id: string ): Observable<any> {
    return this.http.delete( `plan/${id}` );
  }

  getPlans(): Observable<Plan[]> {
    return this.http.get( 'plan' ).pipe(
      map( response => {
        if ( response.success ) {
          return response.planes;
        }
      } )
    );
  }
}
