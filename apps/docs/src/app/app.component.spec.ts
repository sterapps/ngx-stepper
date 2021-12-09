import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgxStepperModule } from '@valentingavran/ngx-stepper';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [NgxStepperModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
