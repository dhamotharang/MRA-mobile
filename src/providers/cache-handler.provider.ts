
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class CacheHandlerProvider {
    public projectsInvited: any = [];
    public projectInvolved: any = [];
    public galleryImage: any = [];


    constructor(
        private storage: Storage,
    ) {

    }





    setupCacheData(roleLevelId) {
        // if (roleLevelId == 9) { // merchant Super Admin
        //     this.roleLevelId = 9
        //     this.storage.get("merchantData").then(data => this.storageMerchantDataFx(data))
        //         .catch(error => this.errorHandler.errorHandlerToRoot(error, "setupCacheData(merchantData)"))
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


