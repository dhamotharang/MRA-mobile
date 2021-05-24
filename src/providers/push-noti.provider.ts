import { Injectable } from '@angular/core';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed, Capacitor} from '@capacitor/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
 
const { PushNotifications } = Plugins;


@Injectable()
export class PushNotiProvider {


    constructor(
        private router: Router,
        private storage: Storage,
    ) {
    }


   registerPush() {
        PushNotifications.requestPermission().then((permission) => {
          if (permission.granted) {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
          } else {
            // No permission for push granted
          }
    });

    PushNotifications.addListener(
        'registration',
        (token: PushNotificationToken) => {
          console.log('My token: ' + JSON.stringify(token));
          let fcmToken = token.value
          this.updateTokenStorage(fcmToken)

    });


    PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error: ' + JSON.stringify(error));
    });


    PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotification) => {
            console.log('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        async (notification: PushNotificationActionPerformed) => {
          const data = notification.notification.data;
          console.log('Action performed: ' + JSON.stringify(notification.notification));
          if (data.detailsId) {
            this.router.navigateByUrl(`/home/${data.detailsId}`);
          }
        });

    }

    updateTokenStorage(token) {  //update token in local storage
      console.log('updateTokenStorage',token)
      this.storage.set('fcmToken', token);
    }

    

}