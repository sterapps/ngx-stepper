import { ChangeDetectionStrategy, Component, ContentChildren, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { Stepper } from '../../services/stepper/stepper.service';
import { StepperStepComponent } from '../stepper-step/stepper-step.component';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: Stepper, useExisting: StepperComponent }, StepperSettings],
})
export class StepperComponent extends Stepper implements OnDestroy {
  @ContentChildren(StepperStepComponent) private readonly steps: QueryList<StepperStepComponent> | undefined;

  @Input()
  public set stepConnectionLine(value: boolean) {
    this.stepperSettings.hasStepConnectionLine$.next(value);
  }

  @Input()
  public set headerNavigation(value: boolean) {
    this.stepperSettings.headerNavigationEnabled$.next(value);
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public readonly onPrevious = this.onPrevious$;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public readonly onNext = this.onNext$;

  private readonly destroyAction$ = new Subject<void>();

  public constructor(private readonly stepperSettings: StepperSettings) {
    super();
  }

  public ngOnDestroy(): void {
    this.destroyAction$.next();
    this.destroyAction$.complete();
  }
}
