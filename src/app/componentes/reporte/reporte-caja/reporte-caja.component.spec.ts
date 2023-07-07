import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCajaComponent } from './reporte-caja.component';

describe('ReporteVentaComponent', () => {
  let component: ReporteCajaComponent;
  let fixture: ComponentFixture<ReporteCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
