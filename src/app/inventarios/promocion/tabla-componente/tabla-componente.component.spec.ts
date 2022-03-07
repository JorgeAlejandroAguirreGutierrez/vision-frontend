import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TablaComponenteComponent } from './tabla-componente.component';

describe('TablaComponenteComponent', () => {
  let component: TablaComponenteComponent;
  let fixture: ComponentFixture<TablaComponenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaComponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
