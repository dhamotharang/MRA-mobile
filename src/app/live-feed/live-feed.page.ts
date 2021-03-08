import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  feedList = [
    {feed_name: 'New Order has been placed',profile_image: 'assets/covid-img.jpg', feed_image: [ {feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {feed_name: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', feed_image: [ {feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {feed_name: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', feed_image: [ {feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'},{feed_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
