import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../classes/store';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() store: Store;
  user: User;
  constructor(
    private router: Router,
    private auth: AuthService){

    this.user = this.auth.getUserActive();
  }

  ngOnInit(): void {
  }

  goToStore(){
    if (this.user.role === 'client'){
      this.router.navigate(['pages/account/user/referrals']);

    } else {
      this.router.navigate([this.store.url_store]);

    }
  }
}
