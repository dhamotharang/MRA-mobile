import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { DomSanitizer } from '@angular/platform-browser';
declare var window;


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
  private currentImage;
  data: any;
  navParam: any;
  secureURL:any = [];

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingProvider: LoadingProvider,
    private sanitize: DomSanitizer,
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

    // this.camera.getPicture(options).then((imageData) => {
    //   this.currentImage = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    //   console.log("Camera issue:" + err);
    // });

    this.camera.getPicture(options).then((imageData) => {
      this.sanitize.bypassSecurityTrustUrl(imageData);
      let x = decodeURIComponent(imageData);
      let name = x.substring(x.lastIndexOf('/') + 1);
       this.currentImage = [{
         name:name,
         thumbnail: this.sanitize.bypassSecurityTrustUrl(imageData),
         uri: imageData,
         type: 'image'
       }];
       console.log('this.currentImage',this.currentImage);
       this.upload();
     });
  }


  upload(){
    this.loadingProvider.presentLoading();
    this.restProvider.cloudinaryUpload(this.currentImage,'feed','proj_pic')
    .then((res) =>{
      console.log('res',res);
        for(let i=0; i < res.length; i++){
          let x = JSON.parse(res[i]);
          this.secureURL = x.secure_url;
        }
      console.log('secureURL',this.secureURL);
      // if(this.purpose == "jumaat")
      // {
      //   console.log('trigger');
      //   this.IssueReceipt();
      // }else{
      //   console.log('not trigger');
      //   this.IssueReceiptOther();
      // }
      this.loadingProvider.closeLoading();

    }).catch(error => {
      console.log('uploadError',error);
      this.loadingProvider.closeLoading();
      // const alert = this.alertCtrl.create({
      //   title: 'Cloudinary Server Error!',
      //   subTitle: 'Please try again later.',
      //   buttons: ['OK']
      // });
      // alert.present();
    })
  }

  // checkSize(path): Promise<any>{
  //   console.log(path);
  //   return new Promise((resolve,reject) => {
  //     window.resolveLocalFileSystemURL(path, (fileEntry) => {
  //         fileEntry.getMetadata((metadata:any) => {
  //             console.log(metadata);
  //             let size = (metadata.size*0.000001).toFixed(2);
  //             console.log(size);
  //             resolve(size);
  //         });
  //     }, (error) => { console.log(error); reject('error') });
  //   });
  // }
  

  postProjectFeed() { //without image
    this.loadingProvider.presentLoading();
    this.restProvider.postProjectFeed(this.postForm.value,this.navParam).then((result:any) => {
      console.log('postProjectFeed',result);
      this.loadingProvider.closeLoading();
      this.exitForm();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  postProjectFeedImage() {

  }

  exitForm() {
    this.navCtrl.back();
  }

}
