import { Injectable } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@Injectable()
export class LaunchNavigatorProvider {

    constructor(
        public launchNavigator: LaunchNavigator,
    ) {
    }

    getAddressNavigate(address, postcode, city, state) {
        return address + ', ' + postcode + ' ' + city + ', ' + state;
    }

    launchNavigation(address) {
        console.log('launchNavigation', address)
        let options: LaunchNavigatorOptions = {
            start: address
        };

        this.launchNavigator.navigate(address)
            .then(
                success => console.log('Launched navigator'))
                // error => console.log('error Launched navigator'))
    }

}