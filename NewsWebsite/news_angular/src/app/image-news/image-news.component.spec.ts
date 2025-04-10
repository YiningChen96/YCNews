import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageNewsComponent } from './image-news.component';

describe('ImageNewsComponent', () => {
  let component: ImageNewsComponent;
  let fixture: ComponentFixture<ImageNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
