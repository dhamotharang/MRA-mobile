import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { PushNotiProvider } from 'src/providers/push-noti.provider';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private platform: Platform,
    private pushProvider: PushNotiProvider
    // private statusBar: StatusBar,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    if (Capacitor.platform !== 'web') {
      this.setupPlatform();
    }
  }

  setupPlatform() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
 
      // Trigger the push setup 
      this.pushProvider.registerPush();
    });
  }

  checkingLogin() {
    this.storage.get('isLoggedIn').then((val:any) => {
      console.log('log? ', val);
      if(val == true){
        this.storage.get('isNewUser').then((res:any) => {
          console.log(res);
          if(res == false){
            // this.getOrg();
            // this.splashScreen.hide();
            // this.nav.setRoot(TabsPage, {condition:'main',opentab: 1});
          }else{
            // this.splashScreen.hide();
            // this.nav.setRoot(ProfileModal);
          }
        });
      }else{
        // this.splashScreen.hide();
        // this.nav.setRoot("HomePage");
      }
    });
  }

}
