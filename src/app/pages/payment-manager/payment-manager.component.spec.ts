import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagerComponent } from './payment-manager.component';

describe('PaymentManagerComponent', () => {
  let component: PaymentManagerComponent;
  let fixture: ComponentFixture<PaymentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
