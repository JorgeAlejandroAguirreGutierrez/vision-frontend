import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PagoCompraComponent } from './pago-compra.component';

describe('PagoCompraComponent', () => {
  let component: PagoCompraComponent;
  let fixture: ComponentFixture<PagoCompraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
