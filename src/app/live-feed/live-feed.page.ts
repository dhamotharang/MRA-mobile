import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  feedList = [
    {feed_name: 'New Order has been placed',feed_image: 'assets/covid-img.jpg'},
    {feed_name: 'New Order has been placed',feed_image: 'assets/gaza-img.jpg'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
