import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagenewsComponent } from './upload-imagenews.component';

describe('UploadImagenewsComponent', () => {
  let component: UploadImagenewsComponent;
  let fixture: ComponentFixture<UploadImagenewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadImagenewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImagenewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
