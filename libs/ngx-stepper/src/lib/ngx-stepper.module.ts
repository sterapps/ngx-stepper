import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepperStepComponent } from './components/stepper-step/stepper-step.component';
import { StepperHeaderComponent } from './components/stepper-header/stepper-header.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StepperComponent, StepperStepComponent, StepperHeaderComponent],
  exports: [StepperComponent, StepperStepComponent, StepperHeaderComponent],
})
export class NgxStepperModule {}
