import { Component, OnInit } from '@angular/core';
import { CreditCard } from '../../shared/classes/credit-card';

@Component( {
  selector: 'app-payment-manager',
  templateUrl: './payment-manager.component.html',
  styleUrls: [ './payment-manager.component.scss' ]
} )
export class PaymentManagerComponent implements OnInit {
  card: CreditCard = {};

  constructor() { }

  ngOnInit(): void {
  }

}
