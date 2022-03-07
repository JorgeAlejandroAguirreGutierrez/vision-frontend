import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TablaEditableComponent } from './tabla-editable.component';

describe('TablaEditableComponent', () => {
  let component: TablaEditableComponent;
  let fixture: ComponentFixture<TablaEditableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
