import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportarComponent } from './importar.component';

describe('AdministracionComponent', () => {
  let component: ImportarComponent;
  let fixture: ComponentFixture<ImportarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
