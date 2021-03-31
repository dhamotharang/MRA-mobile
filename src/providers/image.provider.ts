import { Injectable } from '@angular/core';
// import { NetworkConfigureProvider } from './network-config.provider';

@Injectable()
export class ImageProvider {

    constructor(
        // private networkConfigureProvider: NetworkConfigureProvider
    ) {
    }

    // imageCheckingFx(data, type) {
    //     if (data && this.networkConfigureProvider.abataLiteStatus == false) {
    //         return data
    //     }
    //     else if (this.networkConfigureProvider.abataLiteStatus == true) {
    //         if (type == 'banner') {
    //             // return "assets/img/abatalite_banner.png";
    //             return "assets/img/abatalite400x255.png"
    //         }
    //         else {
    //             // return "assets/img/abatalite_small.png";
    //             return "assets/img/abatalite200x127.png"

    //         }
    //     }
    //     else {
    //         return "assets/img/default_picture.jpg";
    //     }
    // }

    imageErrorHandle(type) {
        if (type == '') {
            return "assets/mra.png"
        }
        else {
            //  data  = 
            // return "assets/img/default_picture.jpg"
            return "assets/mra.png"

        }
    }
}