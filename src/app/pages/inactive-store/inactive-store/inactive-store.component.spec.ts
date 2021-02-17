import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveStoreComponent } from './inactive-store.component';

describe('InactiveStoreComponent', () => {
  let component: InactiveStoreComponent;
  let fixture: ComponentFixture<InactiveStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
