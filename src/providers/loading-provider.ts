import {  LoadingController, Platform  } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';

@Injectable()
export class LoadingProvider {

    redirect: HTMLIonLoadingElement;
    saving: HTMLIonLoadingElement;
    upload: HTMLIonLoadingElement;
    sharing: HTMLIonLoadingElement;
    search: HTMLIonLoadingElement;
    logout: HTMLIonLoadingElement;
    delete: HTMLIonLoadingElement;
    syncing: HTMLIonLoadingElement;
    loading: HTMLIonLoadingElement;
   

    constructor(
        public platform: Platform,
        public loadingCtrl: LoadingController,
        // public events: Events
       
        ) { }

        async setupLoading() {
        this.loading = await this.loadingCtrl.create({
                message: "Please wait...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.loading.present();
        }
    
      
        async setupRedirect() {
            this.redirect =await this.loadingCtrl.create({
                message: "Redirecting...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.redirect.present();
        }
    
        closeRedirect(){
            this.redirect.dismiss()
        }
    
        async setupSaving() {
            this.saving = await this.loadingCtrl.create({
               message: "Saving...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.saving.present();
        }
    
        closeSaving(){
            this.saving.dismiss()
        }
        async setupUpload() {
            this.upload = await this.loadingCtrl.create({
                message: "Uploading...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.upload.present();
        }
    
        closeUpload(){
            this.upload.dismiss()
        }
        async setupSharing() {
            this.sharing =await  this.loadingCtrl.create({
                message: "Sharing...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.sharing.present();
        }
    
        closeSharing(){
            this.sharing.dismiss()
        }
        async setupSearching() {
            this.search = await this.loadingCtrl.create({
                message: "Searching...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.search.present();
        }
    
        closeSearching(){
            this.search.dismiss()
        }
        async setupLogout() {
            this.logout = await this.loadingCtrl.create({
               message: "Logging Out...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.logout.present();
        }
    
        closeLogout(){
            this.logout.dismiss()
        }
        async setupDelete() {
            this.delete = await this.loadingCtrl.create({
                message: "Deleting...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.delete.present();
        }
    
        closeDelete(){
            this.delete.dismiss()
        }
    
        async setupSyncing() {
            this.syncing =await  this.loadingCtrl.create({
                message: "Syncing Data...",
                // enableBackdropDismiss: true,
                // dismissOnPageChange: true
            });
            this.syncing.present();
        }
    
        closeSyncing(){
            this.syncing.dismiss()
        }
        // handleBackButton(){
        //     this.platform.ready().then(() => {
        //         document.addEventListener('backbutton', () => {
        //             this.loading.dismiss()
        //         })
        //       })
        // }

    

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