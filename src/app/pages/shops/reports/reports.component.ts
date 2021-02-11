import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/shared/classes/store';

@Component( {
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: [ './reports.component.scss' ]
} )
export class ReportsComponent implements OnInit, OnChanges {

  active = 'reports';
  subtab = 'daily-sales';
  @Input() store: Store;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.url.subscribe( url => {
      this.active = url[ 2 ].path;
      this.subtab = url[ 3 ].path;
    } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    this.router.navigateByUrl( `pages/account/user/${this.active}/${this.subtab}`, { skipLocationChange: false } );
  }

}
