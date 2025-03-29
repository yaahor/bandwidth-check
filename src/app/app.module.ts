import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CameraModule } from '../features/camera/camera.module';
import { SpinnerModule } from '../widgets/spinner/spinner.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SpinnerModule,
    CameraModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
