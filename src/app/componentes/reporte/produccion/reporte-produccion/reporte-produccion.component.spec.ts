import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProduccionComponent } from './reporte-produccion.component';

describe('ReporteProduccionComponent', () => {
  let component: ReporteProduccionComponent;
  let fixture: ComponentFixture<ReporteProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteProduccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
