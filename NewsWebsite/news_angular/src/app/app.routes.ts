import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { LoginComponent } from './log-in/log-in.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AccountComponent } from './account/account.component';
import { UploadArticlesComponent } from './upload-articles/upload-articles.component';
import { UploadImagenewsComponent } from './upload-imagenews/upload-imagenews.component';
import { DeleteImagenewsComponent } from './delete-imagenews/delete-imagenews.component';
import { DeleteArticlesComponent } from './delete-articles/delete-articles.component';
import { UpdateBackgroundComponent } from './update-background/update-background.component';
import { UpdateLogoComponent } from './update-logo/update-logo.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // 默认跳转到登录页
    { path: 'news/:id', component: NewsComponent },  // 这里是带参路由
    { path: 'log_in', component: LoginComponent },
    { path: 'admin_home', component: AdminHomeComponent },
    { path: 'admin/account', component: AccountComponent },
    { path: 'admin/upload_articles', component: UploadArticlesComponent },
    { path: 'admin/delete_articles', component: DeleteArticlesComponent },
    { path: 'admin/upload_imagenews', component: UploadImagenewsComponent },
    { path: 'admin/delete_imagenews', component: DeleteImagenewsComponent },
    { path: 'admin/background', component: UpdateBackgroundComponent },
    { path: 'admin/logo', component: UpdateLogoComponent },
];
