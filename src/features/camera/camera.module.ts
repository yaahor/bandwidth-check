import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera.component';

@NgModule({
  declarations: [
    CameraComponent,
  ],
  exports: [
    CameraComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class CameraModule { }
