
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


    clearLocalData() {
        this.projectsInvited = [];
        this.projectInvolved = [];
        this.galleryImage = [];
    }
    
}


