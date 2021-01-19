import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { Store } from '../../classes/store';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../classes/user';
import { OrderService } from '../../services/order.service';

@Component( {
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: [ './payment.component.scss' ]
} )
export class PaymentComponent implements OnInit {

  balaceForm: FormGroup;
  paymentForm: FormGroup;
  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febreo' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];
  years = [];
  showReferedAmmount = false;
  showInputAmount = false;
  balance = 0;
  showBalanceAlert = false;
  isFirstShop = false;

  @Input() submitted: boolean;
  @Input() isProfile = false;
  @Input() card: any;
  @Output() enviado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() amount: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild( 'settings' ) settings: SettingsComponent;

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private _formBuilder: FormBuilder,
  ) {
    this.createForm();
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        const decod = window.atob( queryParams.config );
        const store: Store = JSON.parse( decod );
        if ( Object.entries( store ).length !== 0 && this.auth.getUserRol() === 'client' ) {
          this.showReferedAmmount = true;
          this.getAffiliate( store._id );
        }
        this.validateUser();
      }
    } );

    const date = new Date();

    this.years.push( date.getFullYear() );

    for ( let i = 0; i < 12; i++ ) {
      date.setMonth( date.getMonth() + 12 );
      this.years.push( date.getFullYear() );
    }
    if ( this.card ) {
      this.paymentForm.setValue(
        {
          owner: this.card.owner,
          cvv: this.card.cvv,
          card_number: this.card.card_number,
          month: this.card.month,
          year: this.card.year
        }
      );
    }
  }

  onSubmit(): boolean {
    this.submitted = true;
    const tdc = {
      card_number: 0,
      cvv: 0,
      owner: '',
      date: ''
    };
    const data: any = { valid: false, tdc: {} };
    tdc.card_number = this.paymentForm.value.card_number;
    tdc.cvv = this.paymentForm.value.cvv;
    tdc.owner = this.paymentForm.value.owner;
    tdc.date = `${this.paymentForm.value.month}/${this.paymentForm.value.year}`;
    data.valid = this.paymentForm.valid;
    data.tdc = { ...tdc };
    if ( this.paymentForm.valid ) {
      return data;
    } else {
      return false;
    }
  }

  onChange( event: boolean ): void {
    this.showInputAmount = event;
    if ( !event ) {
      this.balaceForm.reset();
      this.showBalanceAlert = false;
      this.amount.emit( 0 );
    }
  }

  onInputChange( val: number ): void {
    if ( val > this.balance ) {
      this.showBalanceAlert = true;
      return;
    }
    this.showBalanceAlert = false;
    this.amount.emit( val );
  }

  private createForm(): void {
    this.balaceForm = this._formBuilder.group( {
      amount: [ '' ]
    } );

    this.paymentForm = this._formBuilder.group( {
      owner: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      cvv: [ '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      card_number: [ '', [ Validators.required, Validators.minLength( 16 ), Validators.pattern( '[0-9]+' ) ] ],
      month: [ '', [ Validators.required ] ],
      year: [ '', [ Validators.required ] ]
    } );

  }

  private getAffiliate( storeId: string ): void {
    this.shopService.getAffiliate( storeId, this.auth.getUserActive()._id ).subscribe( response => {
      this.balance = response.amount;
    } );
  }

  private validateUser(): void {
    const user: User = this.auth.getUserActive();
    if ( user ) {
      this.orderService.orderList( 1, `user=${user._id}` ).subscribe( res => {
        if ( res.docs.length === 0 ) {
          this.isFirstShop = true;
        }
      } );
    } else {
      this.isFirstShop = true;
    }
  }

}
