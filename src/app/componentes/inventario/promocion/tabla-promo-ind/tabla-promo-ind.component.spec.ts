import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TablaPromoIndComponent } from './tabla-promo-ind.component';

describe('TablaPromoIndComponent', () => {
  let component: TablaPromoIndComponent;
  let fixture: ComponentFixture<TablaPromoIndComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaPromoIndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPromoIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
