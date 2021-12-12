import { Directive, HostListener } from '@angular/core';
import { NgxStepper } from '../../services/stepper/stepper.service';

@Directive({
  selector: '[ngxStepperPrevious]',
})
export class StepperPreviousDirective {
  public constructor(private readonly stepper: NgxStepper) {}

  @HostListener('click')
  public onClick(): void {
    this.stepper.previous();
  }
}
