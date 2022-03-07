import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TablaPromoGrupComponent } from './tabla-promo-grup.component';

describe('TablaPromoGrupComponent', () => {
  let component: TablaPromoGrupComponent;
  let fixture: ComponentFixture<TablaPromoGrupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaPromoGrupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPromoGrupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
