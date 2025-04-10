import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-articles',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './upload-articles.component.html',
  styleUrls: ['./upload-articles.component.css']
})
export class UploadArticlesComponent {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required]],
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();

    if (!token || this.isTokenExpired(token)) {
      alert('Not logged in or session expired');
      this.logout();
      return new HttpHeaders(); // 空 headers 避免出错
    }

    return new HttpHeaders({
      'Authorization': token // 只需要传递 Authorization header
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true; // 解码失败视为过期
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);
  }

  // 选择文件
  onFileChange(event: any): void {
    const files: File[] = event.target.files;
    for (let file of files) {
      // 检查文件是否已存在，避免重复上传
      if (!this.selectedFiles.some(existingFile => existingFile.name === file.name)) {
        this.selectedFiles.push(file);
      }
    }
  }

  // 删除已选择的图片
  removeFile(file: File): void {
    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  // 提交表单并上传文章
  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('content', this.uploadForm.get('content')?.value);

      // 添加所有选择的图片文件
      for (let file of this.selectedFiles) {
        formData.append('files', file, file.name);
      }

      // 发送请求到后端，**不要设置 Content-Type**，因为 FormData 会自动设置
      this.http.post('http://localhost:8080/articles/add', formData, {
        headers: this.getAuthHeaders() // 只需传递 Authorization header
      }).subscribe(response => {
        alert('Upload Successfully!');
        // 重置表单和已选择的文件
        this.uploadForm.reset();
        this.selectedFiles = [];
      }, error => {
        alert('Upload failed!');
      });
    } else {
      console.log('Invalid Field!');
    }
  }

  // 取消上传的图片
  cancelUpload(): void {
    this.selectedFiles = [];
  }
}
