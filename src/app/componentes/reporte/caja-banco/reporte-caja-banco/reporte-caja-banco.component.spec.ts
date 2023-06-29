import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCajaBancoComponent } from './reporte-caja-banco.component';

describe('ReporteCajaBancoComponent', () => {
  let component: ReporteCajaBancoComponent;
  let fixture: ComponentFixture<ReporteCajaBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCajaBancoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCajaBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
