import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListItemComponent } from './record-list-item.component';

describe('PlayerComponent', () => {
  let component: RecordListItemComponent;
  let fixture: ComponentFixture<RecordListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
