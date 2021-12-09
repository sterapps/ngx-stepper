import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, OnDestroy, QueryList } from '@angular/core';
import { Stepper } from '../../services/stepper/stepper.service';
import { StepperStepComponent } from '../stepper-step/stepper-step.component';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { Subject, tap } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';

@Component({
  selector: 'ngx-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: Stepper, useExisting: StepperComponent }, StepperSettings],
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
    this.steps!.changes.pipe(
      startWith(this.steps),
      takeUntil(this.destroyAction$),
      map(steps => steps.toArray()),
      tap((steps: StepperStep[]) => {
        setTimeout(() => {
          this.updateSteps(steps);
        }, 0);
      })
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroyAction$.next();
    this.destroyAction$.complete();
  }
}
