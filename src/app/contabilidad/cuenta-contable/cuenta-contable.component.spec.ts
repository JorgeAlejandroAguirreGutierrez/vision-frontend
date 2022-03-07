import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuentaContableComponent } from './cuenta-contable.component';

describe('CuentaComponent', () => {
  let component: CuentaContableComponent;
  let fixture: ComponentFixture<CuentaContableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
