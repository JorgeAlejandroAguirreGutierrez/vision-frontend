import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexMercaderiaComponent } from './kardex-mercaderia.component';

describe('ReporteKardexComponent', () => {
  let component: KardexMercaderiaComponent;
  let fixture: ComponentFixture<KardexMercaderiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KardexMercaderiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexMercaderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
