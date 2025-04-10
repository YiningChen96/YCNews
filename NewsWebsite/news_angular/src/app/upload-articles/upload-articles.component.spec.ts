import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadArticlesComponent } from './upload-articles.component';

describe('UploadArticlesComponent', () => {
  let component: UploadArticlesComponent;
  let fixture: ComponentFixture<UploadArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
