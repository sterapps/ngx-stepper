import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepperHeaderComponent } from './components/stepper-header/stepper-header.component';
import { NgxStep } from './directives/step/step.directive';
import { StepperNextDirective } from './directives/stepper-next/stepper-next.directive';
import { StepperPreviousDirective } from './directives/stepper-previous/stepper-previous.directive';
import { StepperVisitedIconDirective } from './directives/stepper-visited-icon/stepper-visited-icon.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    StepperComponent,
    StepperHeaderComponent,
    NgxStep,
    StepperNextDirective,
    StepperPreviousDirective,
    StepperVisitedIconDirective,
  ],
  exports: [StepperComponent, NgxStep, StepperNextDirective, StepperPreviousDirective, StepperVisitedIconDirective],
})
export class NgxStepperModule {}
