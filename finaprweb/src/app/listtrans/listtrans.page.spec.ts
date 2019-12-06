import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListtransPage } from './listtrans.page';

describe('ListtransPage', () => {
  let component: ListtransPage;
  let fixture: ComponentFixture<ListtransPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListtransPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListtransPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
