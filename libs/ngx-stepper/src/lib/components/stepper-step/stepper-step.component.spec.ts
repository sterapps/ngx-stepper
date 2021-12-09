import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperStepComponent } from './stepper-step.component';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { BehaviorSubject } from 'rxjs';
import { StepperComponent } from '../stepper/stepper.component';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';
import { StepperHeaderComponent } from '../stepper-header/stepper-header.component';

describe('StepperStepComponent', () => {
  let component: StepperStepComponent;
  let fixture: ComponentFixture<StepperStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperStepComponent, StepperHeaderComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
