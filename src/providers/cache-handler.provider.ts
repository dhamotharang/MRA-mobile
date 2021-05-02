
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
// import { ErrorHandlerProvider } from "./error-handler.provider";
// import { Events } from "ionic-angular";
// import { Device } from "@ionic-native/device";

@Injectable()
export class CacheHandlerProvider {


    constructor(
        private storage: Storage,
        // private errorHandler: ErrorHandlerProvider,
        // private event: Events,
        // private device: Device
    ) {

    }

    // getLocalData(key): Promise<any> {
    //     return this.storage.get(key).catch(error => {
    //         this.errorHandler.errorHandlerToRoot(error, "getLocalData()" + key);
    //         return null
    //     })
    // }



    setupCacheData(roleLevelId) {
        // if (roleLevelId == 9) { // merchant Super Admin
        //     this.roleLevelId = 9
        //     this.storage.get("merchantData").then(data => this.storageMerchantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheData(merchantData)"))
        // }
        // else if (roleLevelId == 10) { // merchant Admin
        //     this.roleLevelId = 10
        //     this.storage.get("merchantData").then(data => this.storageMerchantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheData(merchantData)"))
        // }
        // else if (roleLevelId == 11) { // merchant Staff
        //     this.roleLevelId = 11
        //     this.storage.get("merchantData").then(data => this.storageMerchantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheData(merchantData)"))
        // }
        // else if (roleLevelId == 12) { // consultant Super Admin
        //     this.roleLevelId = 12
        //     this.storage.get("consultantData").then(data => this.storageConsultantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheDataconsultantData)"))
        // }
        // else if (roleLevelId == 14) { // consultant Staff
        //     this.roleLevelId = 14
        //     this.storage.get("consultantData").then(data => this.storageConsultantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheData(consultantData)"))
        // }
        // else {
        //     this.errorHandler.errorHandlerToRoot(roleLevelId, "setupCacheData()")
        // }
    }




    clearLocalData() {
        // this.storage.remove('provider');
        // this.storage.remove('token');
        // this.storage.remove('oaid');
        this.storage.remove('defaultPictUrl');
        this.storage.remove('defaultProfile');
        this.storage.remove('defaultPersonId');
        this.storage.set('isLoggedIn', false);
        this.storage.remove('isNewUser');
        this.storage.remove('personOrgs');
        // this.storage.remove('notifList');
        // this.storage.clear();
    }
    
}


