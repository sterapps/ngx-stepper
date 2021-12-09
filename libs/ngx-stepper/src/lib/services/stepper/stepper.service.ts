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

  public updateSteps(steps: StepperStep[]): void {
    if (steps.length === 0) return;

    steps[0].setIsFirstStep(true);
    steps[steps.length - 1].setISLastStep(true);

    // Update index of steps
    let counter = 1;
    steps.forEach(step => {
      step.setOneBasedIndex(counter);
      counter++;
    });

    // On init, set the first step as active
    if (this._steps$.value.length === 0) {
      steps[0].setActive(true);
    }

    this._steps$.next(steps);
  }

  public ngOnDestroy(): void {
    this._destroyAction$.next();
    this._destroyAction$.complete();
  }
}
