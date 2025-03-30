import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
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
    NgOptimizedImage,
    OverlayModule,
  ]
})
export class CameraModule { }
