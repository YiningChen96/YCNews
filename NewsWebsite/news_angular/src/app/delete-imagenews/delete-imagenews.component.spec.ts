import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteImagenewsComponent } from './delete-imagenews.component';

describe('DeleteImagenewsComponent', () => {
  let component: DeleteImagenewsComponent;
  let fixture: ComponentFixture<DeleteImagenewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteImagenewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteImagenewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
