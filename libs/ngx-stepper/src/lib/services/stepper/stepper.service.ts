import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StepperStep } from '../stepper-step/stepper-step.service';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export abstract class Stepper implements OnDestroy {
  private readonly _steps$ = new BehaviorSubject<StepperStep[]>([]);
  public readonly steps$ = this._steps$.asObservable();

  public readonly activeStep$ = this._steps$.pipe(
    map(steps => {
      return steps.find(step => step.getActiveSnapshot());
    })
  );

  private readonly _previousAction = new Subject<void>();
  private readonly _nextAction = new Subject<void>();
  private readonly _navigateToAction = new Subject<StepperStep>();
  private readonly _destroyAction$ = new Subject<void>();

  private readonly _previousHandler$ = this._previousAction.pipe(
    switchMap(() => this._steps$.pipe(take(1))),
    map(steps => {
      let previousStep = null;
      for (const step of steps) {
        if (step.getActiveSnapshot()) {
          if (previousStep) {
            step.setActive(false);
            previousStep.setActive(true);
          }
          break;
        }
        previousStep = step;
      }
    })
  );

  private readonly _nextHandler$ = this._nextAction.pipe(
    switchMap(() => this._steps$.pipe(take(1))),
    map(steps => {
      const activeStepIndex = steps.findIndex(step => step.getActiveSnapshot());
      if (activeStepIndex === -1) return;

      const activeStep = steps[activeStepIndex];
      if (!activeStep.getValidSnapshot()) return;

      const nextIndex = activeStepIndex + 1;
      const nextStep = steps[nextIndex] as StepperStep | undefined;
      if (nextStep === undefined) return;

      activeStep.setActive(false);
      nextStep.setActive(true);
    })
  );

  private readonly _navigateToHandler$ = this._navigateToAction.pipe(
    switchMap(targetStep => {
      return this._steps$.pipe(
        tap(steps => {
          const activeStep = steps.find(step => step.getActiveSnapshot());

          for (const s of steps) {
            if (s !== targetStep) {
              if (s.getValidSnapshot() && s.getVisitedSnapshot()) {
              } else {
                break;
              }
            } else if (s === activeStep) {
              break;
            } else {
              activeStep!.setActive(false);
              targetStep.setActive(true);
              break;
            }
          }
        })
      );
    })
  );

  protected constructor() {
    this._previousHandler$.pipe(takeUntil(this._destroyAction$)).subscribe();
    this._nextHandler$.pipe(takeUntil(this._destroyAction$)).subscribe();
    this._navigateToHandler$.pipe(takeUntil(this._destroyAction$)).subscribe();
  }

  public previous(): void {
    this._previousAction.next();
  }

  public next(): void {
    this._nextAction.next();
  }

  public navigateTo(step: StepperStep): void {
    this._navigateToAction.next(step);
  }

  public ngOnDestroy(): void {
    this._destroyAction$.next();
    this._destroyAction$.complete();
  }

  public addStep(step: StepperStep, index: number): void {
    const steps = this._steps$.value;
    const isFirstTime = steps.length === 0;

    steps.splice(index, 0, step);

    // On init, set the first step as active
    if (isFirstTime) {
      steps[0].setActive(true);
    }

    Stepper.updateIndexesOfSteps(steps);
    Stepper.updateFirstAndLastSteps(steps);

    this._steps$.next(steps);
  }

  public removeStep(step: StepperStep): void {
    const steps = this._steps$.value;
    const index = steps.indexOf(step);
    if (index === -1) return;
    // If the step is active, we need to set the next step as active (previous as fallback)
    if (step.getActiveSnapshot()) {
      step.setActive(false);
      const nextStep = steps[index + 1] as StepperStep | undefined;
      if (nextStep) {
        nextStep.setActive(true);
      } else {
        const previousStep = steps[index - 1] as StepperStep | undefined;
        if (previousStep) {
          previousStep.setActive(true);
        }
      }
    }
    steps.splice(index, 1);

    Stepper.updateIndexesOfSteps(steps);
    Stepper.updateFirstAndLastSteps(steps);

    this._steps$.next(steps);
  }

  private static updateIndexesOfSteps(steps: StepperStep[]): void {
    steps.forEach((s, i) => {
      s.setOneBasedIndex(i + 1);
    });
  }

  private static updateFirstAndLastSteps(steps: StepperStep[]): void {
    steps.forEach((s, i) => {
      s.setIsFirstStep(i === 0);
      s.setISLastStep(i === steps.length - 1);
    });
  }
}
