import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMessagesPage } from './my-messages.page';

describe('MyMessagesPage', () => {
  let component: MyMessagesPage;
  let fixture: ComponentFixture<MyMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMessagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
