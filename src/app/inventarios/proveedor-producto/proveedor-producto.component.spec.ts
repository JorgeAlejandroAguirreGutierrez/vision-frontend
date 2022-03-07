import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProveedorProductoComponent } from './proveedor-producto.component';

describe('SaldoInicialInventarioComponent', () => {
  let component: ProveedorProductoComponent;
  let fixture: ComponentFixture<ProveedorProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedorProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
