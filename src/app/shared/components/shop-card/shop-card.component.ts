import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../classes/store';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() store: Store;

  constructor() {
  }

  ngOnInit(): void {
  }

}
