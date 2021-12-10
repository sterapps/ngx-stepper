import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Stepper } from '../../services/stepper/stepper.service';

@Component({
  selector: 'ngx-stepper-step',
  templateUrl: './stepper-step.component.html',
  styleUrls: ['./stepper-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: StepperStep, useExisting: StepperStepComponent }],
  animations: [
    trigger('verticalStepAnimation', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [style({ height: '*' }), animate(150, style({ height: 0 }))]),
      transition('void => *', [style({ height: '0' }), animate(150, style({ height: '*' }))]),
    ]),
  ],
})
export class StepperStepComponent extends StepperStep implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onActiveStateChange = this.active$;

  @Input()
  public set label(label: string) {
    this.setLabel(label);
  }

  @Input()
  public set valid(valid: boolean) {
    this.setValid(valid);
  }

  public constructor(
    public readonly stepperSettings: StepperSettings,
    public readonly stepper: Stepper,
    protected readonly elementRef: ElementRef
  ) {
    super(stepper);
  }

  public ngOnInit(): void {
    /* The order of ngOnInit is not guaranteed. Therefore, we need to get the
    actual index of the step and provide it to the stepper */
    const index = [...this.elementRef.nativeElement.parentElement.children].findIndex(x => x === this.elementRef.nativeElement);
    this.stepper.addStep(this, index);
  }
}
