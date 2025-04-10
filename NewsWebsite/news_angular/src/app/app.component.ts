import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router,ActivatedRoute} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavBarComponent, HttpClientModule,  CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  returnLink: string = '/home';
  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    // 监听路由变化，根据不同页面设置 returnLink
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      // 根据不同的路由设置返回链接
      if (currentRoute === '/admin_home') {
        this.returnLink = '/log_in';
      } else if (currentRoute === '/log_in') {
        this.returnLink = '/home';
      }else if (currentRoute.startsWith('/admin/')) {
        this.returnLink = '/admin_home';
      }
    });
  }
}
