import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogoComponent } from './update-logo.component';

describe('UpdateLogoComponent', () => {
  let component: UpdateLogoComponent;
  let fixture: ComponentFixture<UpdateLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
