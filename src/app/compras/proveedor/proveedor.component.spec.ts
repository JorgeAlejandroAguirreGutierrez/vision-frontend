import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProveedorComponent } from './proveedor.component';

describe('ProveedorComponent', () => {
  let component: ProveedorComponent;
  let fixture: ComponentFixture<ProveedorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
