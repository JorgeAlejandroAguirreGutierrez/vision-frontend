import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVenta1Component } from './reporte-venta1.component';

describe('ReporteVentaComponent', () => {
  let component: ReporteVenta1Component;
  let fixture: ComponentFixture<ReporteVenta1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVenta1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteVenta1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
