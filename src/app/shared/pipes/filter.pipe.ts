import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'filter'
} )
export class FilterPipe implements PipeTransform {

  transform( value: any[], arg: string ): any[] {

    if ( arg === '' || arg.length < 3 ) { return value; }
    const result = [];
    for ( const val of value ) {
      if ( val.name.toLowerCase().indexOf( arg ) > -1 || val.name.indexOf( arg ) > -1 ) {
        result.push( val );
      }
    }
    return result;
  }

}
