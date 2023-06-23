import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTalentoHumanoComponent } from './reporte-talento-humano.component';

describe('ReporteTalentoHumanoComponent', () => {
  let component: ReporteTalentoHumanoComponent;
  let fixture: ComponentFixture<ReporteTalentoHumanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTalentoHumanoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTalentoHumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
