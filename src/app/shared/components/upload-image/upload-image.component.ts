import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from 'ngx-alerts';

@Component( {
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: [ './upload-image.component.scss' ]
} )
export class UploadImageComponent implements OnInit {

  fakeImage = '../../../../assets/images/marketplace/svg/upload-image.svg';
  images: Array<string> = [];
  @Input() multiple = false;
  @Output() uploadImage: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
  }

  upload( event ): void {
    this.images = [];
    const image = event.target.files[ 0 ];
    const mimeType = image.type;

    if( event.target.files.length > 3){
      this.alert.warning( 'Máximo 3 imagenes' );
      return;
    }

    if ( mimeType.match( /image\/*/ ) == null ) {
      this.alert.warning( 'Solo se permiten archivos de tipo imagen' );
      return;
    }

    if ( event.target.files && event.target.files.length ) {
      for ( const file of event.target.files ) {
        const reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onload = () => {
          const imageBase64 = reader.result as string;
          this.imageBase( imageBase64, event.target.files.length );
        };
      }
    }
  }

  private imageBase( image: string, length: number ): void {
    this.images.push( image );
    if ( this.images.length === length ) {
      this.uploadImage.emit( this.images );
    }
  }

}
