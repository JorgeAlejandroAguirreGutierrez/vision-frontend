import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCuentaCobrarComponent } from './reporte-cuenta-cobrar.component';

describe('ReporteCuentaCobrarComponent', () => {
  let component: ReporteCuentaCobrarComponent;
  let fixture: ComponentFixture<ReporteCuentaCobrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCuentaCobrarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCuentaCobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
