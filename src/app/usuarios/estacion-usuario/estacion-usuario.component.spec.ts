import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstacionUsuarioComponent } from './estacion-usuario.component';

describe('SaldoInicialInventarioComponent', () => {
  let component: EstacionUsuarioComponent;
  let fixture: ComponentFixture<EstacionUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstacionUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
