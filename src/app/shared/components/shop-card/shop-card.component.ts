import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../classes/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() store: Store;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  goToStore(){
    this.router.navigate([this.store.url_store+'/' + this.store._id + '/home']);
  }
}
