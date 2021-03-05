import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe( {
  name: 'addDays'
} )
export class AddDaysPipe implements PipeTransform {

  transform( date: unknown ): unknown {
    console.log( moment( String( date ) ).format( 'DD-MM-YYYY' ), moment( String( date ) ).add( 2, 'days' ).format( 'DD-MM-YYYY' ) );
    return 'kervin';
  }

}
