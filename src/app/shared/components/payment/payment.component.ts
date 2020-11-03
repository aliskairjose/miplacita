import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component( {
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: [ './payment.component.scss' ]
} )
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  months = [ { value: 1, name: 'Enero' },
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
  { value: 12, name: 'Diciembre' } ];
  years = [];
  showReferedAmmount = false;
  showInputAmount = false;

  @Input() submitted: boolean;
  @Output() enviado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() amount: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private _formBuilder: FormBuilder,
  ) {
    this.createForm();
  }


  ngOnInit(): void {

    if ( JSON.parse( sessionStorage.sessionStore ) ) {
      this.showReferedAmmount = true;
    }
    const date = new Date();

    this.years.push( date.getFullYear() );

    for ( let i = 0; i < 12; i++ ) {
      date.setMonth( date.getMonth() + 12 );
      this.years.push( date.getFullYear() );
    }
  }

  onSubmit(): boolean {
    this.submitted = true;
    return this.paymentForm.valid;
  }

  onChange( event: boolean ): void {
    this.showInputAmount = event;
    if ( !event ) { this.amount.emit( 0 ); }
  }

  onInputChange( val: number ): void {
    this.amount.emit( val );
  }

  private createForm(): void {
    this.paymentForm = this._formBuilder.group( {
      owner: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      cvv: [ '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      cardnumber: [ '', [ Validators.required ] ],
    } );
  }

}
