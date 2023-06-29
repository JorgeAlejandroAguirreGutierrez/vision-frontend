import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCuentaPagarComponent } from './reporte-cuenta-pagar.component';

describe('ReporteCuentaPagarComponent', () => {
  let component: ReporteCuentaPagarComponent;
  let fixture: ComponentFixture<ReporteCuentaPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCuentaPagarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCuentaPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
