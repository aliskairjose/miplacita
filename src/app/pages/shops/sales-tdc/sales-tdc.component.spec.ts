import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTdcComponent } from './sales-tdc.component';

describe('SalesTdcComponent', () => {
  let component: SalesTdcComponent;
  let fixture: ComponentFixture<SalesTdcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesTdcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
