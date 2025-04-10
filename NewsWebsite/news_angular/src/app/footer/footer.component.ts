import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input() footerItems: { label: string, link: string }[] = [
    { label: 'About Us', link: 'https://www.linkedin.com/in/yining-chen-7082b426a/' },          // LinkedIn 主页
    { label: 'Contact', link: 'mailto:frank996622@gmail.com' },                                 // 邮箱链接
    { label: 'Careers', link: '/careers' },         // 内部路径
    { label: 'Privacy Policy', link: '/privacy' },  // 内部路径
    { label: 'Terms of Service', link: '/terms' },  // 内部路径
    { label: 'Advertise', link: '/advertise' },     // 内部路径
    { label: 'Help', link: '/help' },               // 内部路径
    { label: 'Sitemap', link: '/sitemap' }          // 内部路径
  ];
}

