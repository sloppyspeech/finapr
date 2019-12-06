import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListexpensesPage } from './listexpenses.page';

describe('ListexpensesPage', () => {
  let component: ListexpensesPage;
  let fixture: ComponentFixture<ListexpensesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListexpensesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListexpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
