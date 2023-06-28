import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteContabilidadComponent } from './reporte-contabilidad.component';

describe('ReporteContabilidadComponent', () => {
  let component: ReporteContabilidadComponent;
  let fixture: ComponentFixture<ReporteContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteContabilidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
