import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { ImageProvider } from 'src/providers/image.provider';

@Component({
  selector: 'app-record-payment',
  templateUrl: './record-payment.page.html',
  styleUrls: ['./record-payment.page.scss'],
})
export class RecordPaymentPage implements OnInit {
  recordList = [
    {project_name: 'Third Wave Covid-19 Emergency',project_image: 'assets/covid-img.jpg',record_name: 'Derma Kilat',start_date:'20/3/2021', description:'Together to help respond to this global outbreak'},
    {project_name: 'Gaza Winter Warming Aid',project_image: 'assets/gaza-img.jpg',record_name: 'Derma Kilat',start_date:'20/3/2021', description:'Together to help respond to this global outbreak'}
  ]

  private image: string;
  private currentImage: string;
  profile: any;
  orgId: any;
  donationList: any;

  constructor(
    private camera: Camera,
    private restProvider: RestProvider,
    private storage: Storage,
    private imageProvider: ImageProvider
  ) { }

  async ngOnInit() {
    await this.storage.get('defaultProfile').then((val:any) => {this.profile = val })
    await this.storage.get('personOrgs').then((val:any) => {this.orgId = val})
    this.getDonation()
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("Camera issue:" + err);
    });
  }

  getDonation(){
    // //this.loadingProvider.setupLoading();
    this.restProvider.getUserDonation(this.profile.personId).then((result:any) => {
      this.donationList = result.filter(x => x.orgId == this.orgId)
      console.log('getDonation',this.donationList);
      // this.getOrg()
      // to make sure UI view is updatinig
      // this.zone.run(() => {
      // for(let i=0; i<result.length; i++){
      //   this.isDonateShown.push(false);
      //   // this.orgs[i].orgProfile.orgLogo = this.sanitize.bypassSecurityTrustUrl('data:image/jpg;base64,'+ result[i].orgProfile.orgLogo);
      // }
      // this.loadingProvider.closeLoading();
      // });
    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }

}
