import { LoadingController, Platform, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';


@Injectable()
export class LoadingProvider {
    setupSaving() {
      throw new Error('Method not implemented.');
    }
    closeSaving() {
      throw new Error('Method not implemented.');
    }
    closeUpload() {
      throw new Error('Method not implemented.');
    }
    setupUpload() {
      throw new Error('Method not implemented.');
    }
    loading;

    constructor(
        public platform: Platform,
        public loadingCtrl: LoadingController,
        // public events: Events
        ) { }

    async presentLoading() {
        this.loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 2000
        });
        await this.loading.present();

        const { role, data } = await this.loading.onDidDismiss();
        console.log('Loading dismissed!');
    }

    // setupLoading() {
    //     this.loading = this.loadingCtrl.create({
    //         content: "Please wait..."
    //     });
    //     this.loading.present();
    // }

    closeLoading() {
        this.loading.dismiss()
    }

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
