import { Component } from '@angular/core';
import { BackgroundComponent } from '../background/background.component';
import { ImageNewsComponent} from '../image-news/image-news.component';
import { NewsListComponent } from '../news-list/news-list.component';
import { AdvertisementComponent } from '../advertisement/advertisement.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [BackgroundComponent, ImageNewsComponent, NewsListComponent,AdvertisementComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  advertisements = [1, 2, 3, 4];  // 创建一个数组来表示四个广告
}
