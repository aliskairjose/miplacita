import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-manager',
  templateUrl: './payment-manager.component.html',
  styleUrls: ['./payment-manager.component.scss']
})
export class PaymentManagerComponent implements OnInit {
  card: any;
  constructor() { }

  ngOnInit(): void {
  }

}
