import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  private project_name: String = 'Third Wave Covid-19 Emergency';
  private project_image: String ='assets/covid-img.jpg'
  private postForm: FormGroup;
  private cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: 0
  }
  private image: string;
  private currentImage: string;
  data: any;
  navParam: any;

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.navParam)
        // this.navParam = this.data
      }
    });
    this.postForm = this.formBuilder.group({
      formName: [],
    });
  }

  getImageFx() {
    this.camera.getPicture(this.cameraOptions).then(data => {
      this.image = 'data:image/jpeg;base64,' + data;
      console.log('image:',this.image);
    }, error => console.log(error, "errorGetImage"))
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

  postProjectFeed() {
    this.restProvider.postProjectFeed(this.postForm.value,this.navParam).then((result:any) => {
      console.log('postProjectFeed',result);
      this.exitForm();
    }, (err) => {
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  exitForm() {
    this.navCtrl.back();
  }

}
