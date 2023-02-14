import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCreditoVentaComponent } from './nota-credito-venta.component';

describe('NotaCreditoVentaComponent', () => {
  let component: NotaCreditoVentaComponent;
  let fixture: ComponentFixture<NotaCreditoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotaCreditoVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaCreditoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
