import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-withdrawal',
  templateUrl: './shop-withdrawal.component.html',
  styleUrls: ['./shop-withdrawal.component.scss']
})
export class ShopWithdrawalComponent implements OnInit {
  paymentDay = '31/12/2020';
  banks = [];
  constructor() { }

  ngOnInit(): void {
  }

}
