import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Injectable({
    providedIn: 'root',
})

export class CallNumberProvider {

    constructor(
        public callNumber: CallNumber
            ) {
    }
    
    dialingFx(phoneNumber) {
        this.callNumber.callNumber(phoneNumber, true)
            .then(res => console.log('Launched dialer!', res))
           // .catch(err => this.errorHandle.errorHandler(err, "callNumber()"));
    }
}