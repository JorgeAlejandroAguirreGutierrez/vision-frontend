import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferenciaBodegaComponent } from './transferencia-bodega.component';

describe('SaldoInicialInventarioComponent', () => {
  let component: TransferenciaBodegaComponent;
  let fixture: ComponentFixture<TransferenciaBodegaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciaBodegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
