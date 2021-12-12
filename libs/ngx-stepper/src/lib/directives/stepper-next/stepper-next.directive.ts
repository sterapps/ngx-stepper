import { Directive, HostListener } from '@angular/core';
import { NgxStepper } from '../../services/stepper/stepper.service';

@Directive({
  selector: '[ngxStepperNext]',
})
export class StepperNextDirective {
  public constructor(private readonly stepper: NgxStepper) {}

  @HostListener('click')
  public onClick(): void {
    this.stepper.next();
  }
}
