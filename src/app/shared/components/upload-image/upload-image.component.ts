import { ToastrService } from 'ngx-toastr';

import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild
  , ViewContainerRef,
  OnChanges,
  OnDestroy
} from '@angular/core';

@Component( {
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: [ './upload-image.component.scss' ]
} )
export class UploadImageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  fakeImage = 'assets/images/marketplace/images/placeholder_.jpg';
  imagesToSend = [];

  @Input() images: Array<string> = [];
  @Input() imagesObject: Array<any> = [];

  @ViewChild( 'ngcarousel' ) ngCarousel: ElementRef;
  @ViewChild( 'carouselbox', { read: ViewContainerRef } ) vc: ViewContainerRef;

  @Input() multiple = false;
  @Input() type = 'product';
  @Output() uploadImage: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  @Output() deleteImage: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  constructor(
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }
  ngOnChanges(): void {
    if ( this.imagesObject.length ) {
      this.images = [];
      this.imagesObject.map( ( image: any ) => {
        this.images.push( image.url );
      } );
    }
  }

  ngOnDestroy() {
    this.imagesObject = [];
  }

  async upload( files ) {
    let limit: number;
    switch ( this.type ) {
      case 'product':
        limit = 3145728; // 3Mb
        break;
      case 'banner':
        limit = 5242880; // 5Mb
        break;
      default:
        limit = 2097152; // 2Mb
        break;
    }

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
    if ( files.length > 4 || this.images.length === 4 ) {
      this.toast.warning( 'Máximo 4 imagenes' );
      return;
    }

    if ( mimeType.match( /image\/*/ ) == null ) {
      this.toast.warning( 'Solo se permiten archivos de tipo imagen' );
      return;
    }
    this.imagesToSend = [];
    if ( files && files.length ) {
      for ( const file of files ) {
        const reader = await new FileReader();
        reader.readAsDataURL( file );
        reader.onload = async () => {
          const imageBase64 = await reader.result as string;
          this.images.push( imageBase64 );
          this.imagesToSend.push( imageBase64 );
          this.imageBase( this.imagesToSend, files.length );
        };
      }

    }
  }

  private imageBase( image: string[], length: number ): void {
    if ( this.imagesToSend.length === length ) {
      this.uploadImage.emit( this.imagesToSend );
      this.imagesToSend = [];
    }
  }

  update( item ) {
    // this.ngCarousel.select( item );
  }

  delete( index, url ) {
    if ( this.images.length === 1 ) {
      this.toast.warning( 'Debes conservar al menos una imagen para tu tienda' );
      return;
    }
    const image = this.imagesObject.find( i => i.url === url );
    this.deleteImage.emit( image );
    this.images.splice( index, 1 );

  }

}
