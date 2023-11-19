import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductoProveedorComponent } from './producto-proveedor.component';

describe('SaldoInicialInventarioComponent', () => {
  let component: ProductoProveedorComponent;
  let fixture: ComponentFixture<ProductoProveedorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
