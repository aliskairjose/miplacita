import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: [ './social.component.scss' ]
} )
export class SocialComponent implements OnInit {
  apiFB = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
  apiWA = `https://api.whatsapp.com/send?text=${window.location.href}`;
  apiTW = `https://twitter.com/intent/tweet?text=Mira esto!&url=${window.location.href}&hashtags=#marketplace`;
  base = 'https://marketplace.dev.cronapis.com/';

  constructor() { }

  ngOnInit(): void {

  }

}
