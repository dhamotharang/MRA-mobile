import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { LaunchNavigatorProvider } from 'src/providers/launch-navigator.provider';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { PushNotiProvider } from 'src/providers/push-noti.provider';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as $ from 'jquery';
import { AlertProvider } from 'src/providers/alert-provider';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    CallNumber,
    LaunchNavigator,
    Camera,
    CallNumberProvider,
    LaunchNavigatorProvider,
    InAppBrowser,
    EmailComposer,
    RestProvider,
    ImageProvider,
    LoadingProvider,
    FileTransfer,
    File,
    CacheHandlerProvider,
    PushNotiProvider,
    Geolocation,
    NativeGeocoder,
    HTTP,
    GooglePlus,
    AlertProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
