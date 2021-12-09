import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, OnDestroy, QueryList } from '@angular/core';
import { Stepper } from '../../services/stepper/stepper.service';
import { StepperStepComponent } from '../stepper-step/stepper-step.component';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: Stepper, useClass: StepperComponent }, StepperSettings],
})
export class StepperComponent extends Stepper implements AfterContentInit, OnDestroy {
  @ContentChildren(StepperStepComponent) private readonly steps: QueryList<StepperStepComponent> | undefined;

  @Input()
  public set stepConnectionLine(value: boolean) {
    this.stepperSettings.hasStepConnectionLine$.next(value);
  }

  @Input()
  public set headerNavigation(value: boolean) {
    this.stepperSettings.headerNavigationEnabled$.next(value);
  }

  private readonly destroyAction$ = new Subject<void>();

  public constructor(private readonly stepperSettings: StepperSettings) {
    super();
  }

  public ngAfterContentInit(): void {
    if (this.steps) {
      this.steps.forEach((step: StepperStepComponent) => {
        this.addStep(step);
      });
    }
  }

  public ngOnDestroy(): void {
    this.destroyAction$.next();
    this.destroyAction$.complete();
  }
}
