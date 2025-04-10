import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBackgroundComponent } from './update-background.component';

describe('UpdateBackgroundComponent', () => {
  let component: UpdateBackgroundComponent;
  let fixture: ComponentFixture<UpdateBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
