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

  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }

  updateSubtab( tab ) {
    this.subtab = tab;
    this.router.navigateByUrl( `pages/account/user/${this.active}/${this.subtab}`, { skipLocationChange: false } );
  }

  private init(): void {

  }

  private loadReportData(): void {

  }
}
