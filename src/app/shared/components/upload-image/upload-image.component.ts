import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: [ './upload-image.component.scss' ]
} )
export class UploadImageComponent implements OnInit {

  fakeImage = '../../../../assets/images/marketplace/svg/plus-circle.svg';
  images: Array<string> = [];
  @Input() multiple = false;
  @Output() uploadImage: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(
    private toastrService: ToastrService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  upload( files ): void {
    console.log( files );
    const limit = 102400;

    for ( const key in files ) {
      if ( Object.prototype.hasOwnProperty.call( files, key ) ) {
        const file = files[ key ];
        if ( file.size > limit ) {
          this.toast.warning( 'La imagen es demasiado grande' );
          return;
        }
      }
    }

    this.images = [];
    // const image = event.target.files[ 0 ];
    const image = files[ 0 ];
    const mimeType = image.type;

    if ( files.length > 3 ) {
      this.toastrService.warning( 'Máximo 3 imagenes' );
      return;
    }

    if ( mimeType.match( /image\/*/ ) == null ) {
      this.toastrService.warning( 'Solo se permiten archivos de tipo imagen' );
      return;
    }

    if ( files && files.length ) {
      for ( const file of files ) {
        const reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onload = () => {
          const imageBase64 = reader.result as string;
          this.imageBase( imageBase64, files.length );
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
