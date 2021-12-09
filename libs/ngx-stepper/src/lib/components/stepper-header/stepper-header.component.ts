import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { StepperStep } from '../../services/stepper-step/stepper-step.service';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { StepperSettings } from '../../services/stepper-settings/stepper-settings.service';
import { Stepper } from '../../services/stepper/stepper.service';

@Component({
  selector: 'ngx-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: ['./stepper-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperHeaderComponent implements OnDestroy {
  private readonly destroyAction$ = new Subject<void>();

  public readonly topStepConnectionLineVisible$ = combineLatest([this.step.isFirstStep$, this.stepperSettings.hasStepConnectionLine$]).pipe(
    map(([isFirstStep, hasStepConnectionLine]) => !isFirstStep && hasStepConnectionLine)
  );

  public readonly bottomStepConnectionLineVisible$ = combineLatest([
    this.step.isLastStep$,
    this.stepperSettings.hasStepConnectionLine$,
  ]).pipe(map(([isLastStep, hasStepConnectionLine]) => !isLastStep && hasStepConnectionLine));

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly stepper: Stepper,
    private readonly stepperSettings: StepperSettings,
    public readonly step: StepperStep
  ) {
    this.activeHandler$.pipe(takeUntil(this.destroyAction$)).subscribe();
    this.headerNavigationEnabledHandler$.pipe(takeUntil(this.destroyAction$)).subscribe();
  }

  private readonly activeHandler$ = this.step.active$.pipe(
    distinctUntilChanged(),
    tap(active => {
      active ? this.elementRef.nativeElement.classList.add('active') : this.elementRef.nativeElement.classList.remove('active');
    })
  );

  private readonly headerNavigationEnabledHandler$ = this.stepperSettings.headerNavigationEnabled$.pipe(
    distinctUntilChanged(),
    tap(enabled => {
      enabled ? (this.elementRef.nativeElement.style.pointerEvents = 'auto') : (this.elementRef.nativeElement.style.pointerEvents = 'none');
    })
  );

  public ngOnDestroy(): void {
    this.destroyAction$.next();
    this.destroyAction$.complete();
  }

  @HostListener('click')
  private navigate(): void {
    if (this.stepperSettings.headerNavigationEnabled$.value) {
      this.stepper.navigateTo(this.step);
    }
  }
}
