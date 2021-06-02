import { LoadingController, Platform, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';


@Injectable()
export class LoadingProvider {
  loading;
  public loadingPresent: boolean = false;

    constructor(
        public platform: Platform,
        public loadingCtrl: LoadingController,
        // public events: Events
        ) { }

    async presentLoading() {
      this.loadingPresent = true
        this.loading = await this.loadingCtrl.create({
          message: "Please wait...",
          cssClass: 'my-custom-class'
        });
        await this.loading.present();
    }

    async closeLoading() {
      if (this.loadingPresent) {
        this.loadingPresent = false
        await this.loading.dismiss();
      }
    }

    async presentSaving() {
      this.loadingPresent = true
        this.loading = await this.loadingCtrl.create({
          message: "Please wait...",
          cssClass: 'my-custom-class'
        });
        await this.loading.present();
    }


    async closeSaving() {
      if (this.loadingPresent) {
        this.loadingPresent = false
        await this.loading.dismiss();
      }
    }


    closeUpload() {
      throw new Error('Method not implemented.');
    }


    setupUpload() {
      throw new Error('Method not implemented.');
    }


  //   async presentLoading() {
  //     this.loading = await this.loadingCtrl.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Please wait...',
  //     duration: 2000
  //     });
  //     await this.loading.present();

  //     const { role, data } = await this.loading.onDidDismiss();
  //     console.log('Loading dismissed!');
  // }


  // async closeLoading() {
  //   await this.loading.dismiss()
  //     this.loading = await this.loadingCtrl.create({
  //       cssClass: 'my-custom-class',
  //       message: 'Please wait...',
  //       duration: 2000
  //       });
  //       await this.loading.present();
  //       const { role, data } = await this.loading.onDidDismiss();
  //       console.log('closeLoading');
  // }


    // setupLoadingDynamic(option) {
    //     this.loading = this.loadingCtrl.create(this.setupLoadingDynamicOption(option));
    //     this.loading.present();
    // }

    // setupLoadingDynamicOption(message) {
    //     switch (message) {
    //         case ('addToCartLoading'):
    //             return {
    //                 content: 'Adding To Cart'
    //             }

    //         default:
    //             break;
    //     }


    // }

}
