import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { PushNotiProvider } from 'src/providers/push-noti.provider';
import { Capacitor, StatusBarStyle } from '@capacitor/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private platform: Platform,
    private pushProvider: PushNotiProvider,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    if (Capacitor.platform !== 'web') {
      this.setupPlatform();
    }
    else {
      this.checkingLogin();
    }
  }

  setupPlatform() {
    this.platform.ready().then(() => {
      StatusBar.setStyle({ style: StatusBarStyle.Light });
      SplashScreen.show();
      this.checkingLogin();
      this.pushProvider.registerPush();       // Trigger the push setup 
    });
  }

  checkingLogin() {
    this.storage.get('isLoggedIn').then((val:any) => {
      console.log('log? ', val);
      if(val == true){
        this.storage.get('isNewUser').then((res:any) => {
          console.log(res);
          if(res == false){
            this.storage.get('fromQuickLogin').then((result:any) => {
              if (result == false) {
                SplashScreen.hide();
                this.router.navigateByUrl('/tabs');
              }else{
                SplashScreen.hide();
                this.router.navigateByUrl('/payment-history');
              }
            })

          }else{
            SplashScreen.hide();
            this.router.navigateByUrl('/profile');
          }
        });
      }else{
          SplashScreen.hide();
          this.router.navigateByUrl('/launch');
      }
    });
  }

}
