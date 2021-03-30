import { Component } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'launch.page.html',
  styleUrls: ['launch.page.scss'],
})
export class LaunchPage {
  param = {
    providerCode: "",
    providerId: "",
    token: "",
    platform:""
  }


  constructor(
    private restProvider: RestProvider,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
  }

  loginFx() {
    // this.restProvider.appConf("MCAN");
    this.param.providerCode = "google";
    this.param.providerId = 'aisah@oas.my';
  }

  navToHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.param
      }
    };
    this.router.navigate(['tabs'], navigationExtras);
  }

  
}
