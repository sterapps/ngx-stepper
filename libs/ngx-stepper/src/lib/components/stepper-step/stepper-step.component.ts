import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { StepperComponent } from '../stepper/stepper.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
export class StepperStepComponent extends StepperStep {
  @Input()
  public set label(label: string) {
    this.setLabel(label);
  }

  @Input()
  public set valid(valid: boolean) {
    this.setValid(valid);
  }

  public constructor(public readonly stepperSettings: StepperSettings, public readonly stepper: StepperComponent) {
    super();
  }
}
