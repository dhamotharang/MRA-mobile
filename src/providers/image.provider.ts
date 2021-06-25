import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingProvider } from './loading-provider';
import { RestProvider } from './rest/rest';
import { AlertProvider } from './alert-provider';

@Injectable()
export class ImageProvider {
    private image: string;
      param: { upload_preset: string; folder: string; file: string; };
      private secureURL:any = [];
      imgList = [];

    constructor(
        private camera: Camera,
        private loadingProvider: LoadingProvider,
        private restProvider: RestProvider,
        private alertProvider: AlertProvider
    ) {
    }

    imageErrorHandle(type) {
        if (type == '') {
            return "assets/mra.png"
        }
        else if ('profile') {
            return "https://apache01.oas.my/t1/mra/assets/media/users/blank.png"
        }
        else {
            //  data  = 
            // return "assets/img/default_picture.jpg"
            return "assets/mra.png"

        }
    }


    uploadImageCamera(detail, type) {
        this.image = null;
        const cameraOptions: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: true,
          }
        this.camera.getPicture(cameraOptions).then(mediaData => {
          console.log(mediaData);
          this.image = 'data:image/jpeg;base64,' + mediaData;
          this.param = {
               'upload_preset': 'c4gf0qoq',
               'folder': 'mra/gallery',
               'file':this.image,
             };
          this.upload(detail, type);
         }, (err) => {
           console.log(err);
         });

    }

    uploadImageGallery(detail, type) {
        this.image = null;
        const cameraOptions: CameraOptions = {
            quality: 20,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: 0
          }
        this.camera.getPicture(cameraOptions).then(data => {
          this.image = 'data:image/jpeg;base64,' + data;
          this.param = {
            'upload_preset': 'c4gf0qoq',
            'folder': 'mra/gallery',
            'file':this.image,
          };
          this.upload(detail, type);
        }, error => console.log(error, "errorGetImage"))
    }

    upload(detail,type){
        // this.loadingProvider.presentLoading();
        this.restProvider.imageUpload(this.param)
          .then((res) => {
            // this.loadingProvider.closeLoading();
            this.secureURL = null
            let result = JSON.parse(res)
            this.secureURL = result.eager[0].secure_url
            console.log('this.secureURL',this.secureURL);
            this.postImageTask(detail,type)
            // this.alertProvider.successAlert()
        }).catch(error => {
            // this.loadingProvider.closeLoading();
            console.log(error);
            this.alertProvider.errorAlertParam('Error!','Error upload image!')
        })
    }

    postImageTask(detail,type) {
        console.log('postImageTask',detail,type)
        this.loadingProvider.presentLoading();
        if (type == 'feed') {
            this.restProvider.postFeedImage(detail.feedId,detail,this.secureURL,null).then((result:any) => {
                this.loadingProvider.closeLoading();
                // this.exitForm();
                this.alertProvider.successAlert()
              }, (err) => {
                console.log(err);
                this.loadingProvider.closeLoading();
                this.alertProvider.errorAlert()
                // this.showAlert();
              });
        }
        else if (type == 'task') {
            this.restProvider.postFeedImage(null,detail,this.secureURL,detail.taskId).then((result:any) => {
                this.loadingProvider.closeLoading();
                // this.exitForm();
                this.alertProvider.successAlert()
              }, (err) => {
                console.log(err);
                this.loadingProvider.closeLoading();
                this.alertProvider.errorAlert()
                // this.showAlert();
              });
        }
  
    }
}