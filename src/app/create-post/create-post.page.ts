import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  private project_name: String = 'Third Wave Covid-19 Emergency';
  private project_image: String ='assets/covid-img.jpg'

  constructor() { }

  ngOnInit() {
  }

}
