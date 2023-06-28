import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteImportacionComponent } from './reporte-importacion.component';

describe('ReporteImportacionComponent', () => {
  let component: ReporteImportacionComponent;
  let fixture: ComponentFixture<ReporteImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteImportacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
