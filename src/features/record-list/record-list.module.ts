import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListItemComponent } from './record-list-item.component';



@NgModule({
  declarations: [
    RecordListItemComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RecordListItemComponent,
  ]
})
export class RecordListModule { }
