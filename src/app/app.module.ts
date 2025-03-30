import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { CameraModule } from '../features/camera/camera.module';
import { SpinnerModule } from '../widgets/spinner/spinner.module';
import { AppComponent } from './app.component';
import { RecordedVideosState } from './model/recorded-videos.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SpinnerModule,
    CameraModule,
    NgxsModule.forRoot([RecordedVideosState], {
      developmentMode: true
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
