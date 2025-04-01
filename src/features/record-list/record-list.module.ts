import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RecordListItemComponent } from './record-list-item.component';



@NgModule({
  declarations: [
    RecordListItemComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
  ],
  exports: [
    RecordListItemComponent,
  ]
})
export class RecordListModule { }
