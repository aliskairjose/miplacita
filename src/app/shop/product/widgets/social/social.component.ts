import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { Meta } from '@angular/platform-browser';

@Component( {
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: [ './social.component.scss' ]
} )
export class SocialComponent implements OnInit, OnChanges {
  @Input() product: any;
  image: any;
  apiFB = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
  apiWA = `https://api.whatsapp.com/send?text=${window.location.href}`;
  apiTW = `https://twitter.com/intent/tweet?text=Mira esto!&url=${window.location.href}&hashtags=#marketplace`;
  base = 'https://marketplace.dev.cronapis.com/';

  constructor(
    private meta: Meta,

  ) { }

  ngOnInit(): void {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    // if ( changes.product ) {
    //   this.product = changes.product.currentValue;
    //   this.meta.updateTag( { property: 'og:image', content: this.product?.images[ 0 ]?.url } );
    // }
  }

}
