import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class RestProvider {

    appConfheaders: any = new HttpHeaders().set('Content-Type', 'application/json');
    token: any = 'sdf2f6c2h5g333431293813113126528162203526172114910252443223363773918181930INTERNAL';

    constructor(
        public http: HttpClient,
    ) {
    }

    appConf(app) {
        return new Promise((resolve, reject) => {
            let devplink = 'http://192.168.43.221:8181/hss-start-0.0.1-SNAPSHOT/app/config/r';
            // let devplink = 'https://www.myjiran.my/myjiran-oas-admin-0.0.1-SNAPSHOT/app/config/r'; 
            this.http.post(devplink, [app], {
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token)
            })
                .subscribe((res: any) => {
                    resolve(res);
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/project/v/320
    async getProjectList(orgId){
        try{
          let app = await this.appConf("PRJL");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/project/v/"+orgId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/det/v/{projId}
    async getProjectDetail(orgId){
        try{
          let app = await this.appConf("PRJL");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/det/v/"+7,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/v/{projId}
    async getProjectFeed(orgId){
        try{
          let app = await this.appConf("PRJL");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/feed/v/"+7,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }


}