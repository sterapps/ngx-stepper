import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperHeaderComponent } from './stepper-header.component';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { StepperComponent } from '../stepper/stepper.component';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';
import { BehaviorSubject } from 'rxjs';

describe('StepperHeaderComponent', () => {
  let component: StepperHeaderComponent;
  let fixture: ComponentFixture<StepperHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperHeaderComponent],
      providers: [
        {
          provide: StepperSettings,
          useValue: {
            hasStepConnectionLine$: new BehaviorSubject(true),
            headerNavigationEnabled$: new BehaviorSubject(true),
          },
        },
        {
          provide: StepperComponent,
          useValue: {
            activeStep$: new BehaviorSubject<StepperStep | null>(null),
          },
        },
        {
          provide: StepperStep,
          useValue: {
            oneBasedIndex$: new BehaviorSubject(1),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
