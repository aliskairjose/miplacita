import { ToastrService } from 'ngx-toastr';

import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild
  , ViewContainerRef
} from '@angular/core';

@Component( {
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: [ './upload-image.component.scss' ]
} )
export class UploadImageComponent implements OnInit, AfterViewInit {

  fakeImage = '../../../../assets/images/marketplace/svg/plus-circle.svg';
  images: Array<string> = [];

  @ViewChild( 'ngcarousel' ) ngCarousel: ElementRef;
  @ViewChild( 'carouselbox', { read: ViewContainerRef } ) vc: ViewContainerRef;

  @Input() multiple = false;
  @Output() uploadImage: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(
    private toastrService: ToastrService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

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

    if ( !this.multiple ) { this.images = []; }
    const image = files[ 0 ];
    const mimeType = image.type;

    if ( files.length > 3 || this.images.length === 3 ) {
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
    console.log( image );

    this.images.push( image );
    if ( this.images.length === length ) {
      this.uploadImage.emit( this.images );
    }
  }

  update( item ) {
    // this.ngCarousel.select( item );
  }

  delete( idItem ) {
    this.images.splice( idItem, 1 );
  }

}
