import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraDirective } from './camera.directive';

@NgModule({
  declarations: [
    CameraDirective
  ],
  exports: [
    CameraDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CameraModule { }
