import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
  ],
  exports: [
    SpinnerComponent,
  ],
})
export class SpinnerModule {}
