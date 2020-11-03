import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePaymentsComponent } from './store-payments.component';

describe('StorePaymentsComponent', () => {
  let component: StorePaymentsComponent;
  let fixture: ComponentFixture<StorePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
