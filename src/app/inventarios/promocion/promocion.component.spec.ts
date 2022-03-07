import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromocionComponent } from './promocion.component';

describe('PromocionComponent', () => {
  let component: PromocionComponent;
  let fixture: ComponentFixture<PromocionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
