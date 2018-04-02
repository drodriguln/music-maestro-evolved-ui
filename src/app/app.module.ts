import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RestService } from './service/rest/rest.service';
import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { UploadComponent } from './upload/upload.component';
import { PlayerComponent } from './player/player.component';


@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    UploadComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
