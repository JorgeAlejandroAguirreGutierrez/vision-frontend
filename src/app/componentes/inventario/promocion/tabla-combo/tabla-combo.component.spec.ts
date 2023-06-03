import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TablaComboComponent } from './tabla-combo.component';

describe('TablaComboComponent', () => {
  let component: TablaComboComponent;
  let fixture: ComponentFixture<TablaComboComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
