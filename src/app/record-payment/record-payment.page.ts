import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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

  constructor(
    private camera: Camera
  ) { }

  ngOnInit() {
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

}
