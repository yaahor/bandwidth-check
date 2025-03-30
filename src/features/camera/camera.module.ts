import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CameraComponent } from './camera.component';

@NgModule({
  declarations: [
    CameraComponent,
  ],
  exports: [
    CameraComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ]
})
export class CameraModule { }
