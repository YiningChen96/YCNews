import { Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-background',
  imports: [CommonModule,  RouterModule],
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent {
 imageUrls: string[]=[];
 constructor(private http: HttpClient, private router: Router) {}
 ngOnInit(): void {
  this.http.get<string[]>('http://localhost:8080/images/getAllBackgroundImages').subscribe({
    next: (response: string[]) => {
      response.forEach((url: string)=>{
        this.imageUrls.push( `http://localhost:8080${url}`);
      });
    },
    error: (error) => {
      console.error('Can not get logo Url from Backend:', error);
    },
  });
}
}
