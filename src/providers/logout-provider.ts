//A service provider is an Angular abstraction which can be used in any other component,
//page or service via the Angular Dependency Injection or DI.
//You can use providers to encapsulate code which's common between many places of your application
// so instead of repeating the same logic in many places you can isolate that code into its own service
//and inject it wherever you want to use it.

//run on cmd, ionic g provider rest
import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from  'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/forkJoin';
// import { timeout, catchError } from 'rxjs/operators';
// import { Nav, AlertController, Events, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from  '../providers/loading-provider';
import { RestProvider } from  '../providers/rest/rest';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController } from '@ionic/angular';
// import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { CacheHandlerProvider } from './cache-handler.provider';

declare var google;
// declare var window;
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogoutProvider {

token:any;

  constructor(
    // public http: HttpClient,
    public alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    private storage: Storage,
    // public events: Events,
    // public platform: Platform,
    private googlePlus: GooglePlus,
    public restProvider: RestProvider,
    private cacheHandlerProvider: CacheHandlerProvider
  ) {
    console.log("Hello LogoutProvider");
  }

  logoutGoogle() {
    // this.loadingProvider.presentLoading();
    return new Promise((resolve, reject) => {
      if (Capacitor.platform !== 'web') {
        const options = {
          offline: false
        };
        this.googlePlus.trySilentLogin(options).then(res => {
          this.googlePlus.logout().then(res => {
              console.log('google logut success',res);
              // this.loadingProvider.closeLoading();
              this.deleteToken();
              resolve();
            }).catch(error => {
               console.error('google logout error '+error);
               reject('google logout error ');
            });
        }).catch(error => {
          console.error('silent login error '+error);
          this.googlePlus.disconnect().then(res => {
            console.log('google disconect sucess',res);
            // this.loadingProvider.closeLoading();
            this.deleteToken();
            resolve();
          }).catch(error => {
             console.error('google disconnect error '+error);
             reject('google disconnect error ');
          });
        });
      }
      else {
        // this.loadingProvider.closeLoading();
        this.deleteLocalValue();
        resolve();
      }
    });
  }

  deleteLocalValue(){
    this.storage.remove('provider');
    this.storage.remove('role');
    this.storage.remove('profilePictUrl');
    this.storage.remove('defaultProfile');
    this.storage.remove('defaultPersonId');
    this.storage.set('isLoggedIn', false);
    this.storage.remove('isNewUser');
    this.storage.remove('nonOrgPersonId');
    this.storage.remove('personOrgs');
    this.storage.remove('personOrgList')
    this.cacheHandlerProvider.clearLocalData()
    this.storage.clear();
  }

  deleteToken(){
    this.storage.get('fcmToken').then((val:any) => {
        console.log(val);
        this.token = val;
        this.restProvider.deleteToken(this.token).then((result:any) => {
            console.log('firebase token deleted ',result);
            this.storage.remove('provider');
            this.storage.remove('fcmToken');
            this.storage.remove('role');
            this.storage.remove('profilePictUrl');
            this.storage.remove('defaultProfile');
            this.storage.remove('defaultPersonId');
            this.storage.set('isLoggedIn', false);
            this.storage.remove('isNewUser');
            this.storage.remove('nonOrgPersonId');
            this.storage.remove('personOrgs');
            this.storage.remove('personOrgList')
            this.cacheHandlerProvider.clearLocalData()
            this.storage.clear();
        }, (err) => {
            console.log(err);
        });
    });
  }

}
