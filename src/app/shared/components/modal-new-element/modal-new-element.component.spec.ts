import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewElementComponent } from './modal-new-element.component';

describe('ModalNewElementComponent', () => {
  let component: ModalNewElementComponent;
  let fixture: ComponentFixture<ModalNewElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
