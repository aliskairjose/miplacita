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
  @Input() images: Array<string> = [];
  @Input() imagesObject: Array<any> = [];

  @ViewChild( 'ngcarousel' ) ngCarousel: ElementRef;
  @ViewChild( 'carouselbox', { read: ViewContainerRef } ) vc: ViewContainerRef;

  @Input() multiple = false;
  @Input() type = '';
  @Output() uploadImage: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  @Output() deleteImage: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  constructor(
    private toastrService: ToastrService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }
  ngOnChanges( ): void {
    if(this.imagesObject.length){
      this.imagesObject.map((image: any)=>{
        this.images.push(image.url);
      });
    };
  }

  ngOnDestroy(){
    this.imagesObject = [];
  }
  upload( files ): void {

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
    console.log("lista", this.images);
    if ( files.length > 4 || this.images.length === 3 ) {
      this.toastrService.warning( 'Máximo 4 imagenes' );
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
    let images = [];
    this.images.push( image );
    images.push( image );
    if ( images.length === length ) {
      this.uploadImage.emit( images );
      images = [];
    }
  }

  update( item ) {
    // this.ngCarousel.select( item );
  }

  delete( idItem ) {
    this.deleteImage.emit(this.imagesObject[idItem]);
    this.images.splice( idItem, 1 );
  }

}
