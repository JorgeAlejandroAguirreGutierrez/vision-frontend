import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteActivoFijoComponent } from './reporte-activo-fijo.component';

describe('ReporteActivoFijoComponent', () => {
  let component: ReporteActivoFijoComponent;
  let fixture: ComponentFixture<ReporteActivoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteActivoFijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteActivoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
