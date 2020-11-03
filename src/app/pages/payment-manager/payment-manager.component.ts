import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-manager',
  templateUrl: './payment-manager.component.html',
  styleUrls: ['./payment-manager.component.scss']
})
export class PaymentManagerComponent implements OnInit {
  cards = [
    { name: 'Nairelys Hernandez', numberCard: '****0321', type: 'Mastercard'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
