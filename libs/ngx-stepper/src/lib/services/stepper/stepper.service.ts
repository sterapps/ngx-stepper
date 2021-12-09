import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, Subject } from 'rxjs';
import { StepperStep } from '../stepper-step/stepper-step.service';
import { shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { filterEmpty } from '../../utils/operator-functions';

@Injectable()
export abstract class Stepper implements OnDestroy {
  private readonly _firstStep$ = new BehaviorSubject<StepperStep | null>(null);
  private readonly _lastStep$ = new BehaviorSubject<StepperStep | null>(null);

  private readonly _activeStep$ = new BehaviorSubject<StepperStep | null>(null);
  public readonly activeStep$: Observable<StepperStep | null> = this._activeStep$.asObservable().pipe(shareReplay(1));

  private readonly _length$ = new BehaviorSubject<number>(0);
  public readonly length$ = this._length$.asObservable().pipe(shareReplay(1));

  private readonly _previousAction = new Subject<void>();
  private readonly _nextAction = new Subject<void>();
  private readonly _navigateToAction = new Subject<StepperStep>();
  private readonly _destroyAction$ = new Subject<void>();
  private readonly _stepsChangedAction$ = new Subject<void>();

  private readonly _previousHandler$ = this._previousAction.pipe(
    switchMap(() => this._activeStep$.pipe(take(1))),
    filterEmpty(),
    switchMap(activeStep => {
      return activeStep.previous$.pipe(
        take(1),
        tap(previousStep => {
          if (previousStep === null) return;
          activeStep.setVisited(true);
          this._activeStep$.next(previousStep);
        })
      );
    })
  );

  private readonly _nextHandler$ = this._nextAction.pipe(
    switchMap(() => this._activeStep$.pipe(take(1))),
    filterEmpty(),
    switchMap(activeStep =>
      activeStep.valid$.pipe(
        take(1),
        switchMap(valid => {
          if (!valid) return NEVER;
          return activeStep.next$.pipe(
            take(1),
            tap(nextStep => {
              if (nextStep === null) return;
              nextStep.setVisited(true);
              this._activeStep$.next(nextStep);
            })
          );
        })
      )
    )
  );

  private readonly _navigateToHandler$ = this._navigateToAction.pipe(
    switchMap(step => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const activeStep = this._activeStep$.value!;
      if (!activeStep.getValidSnapshot() && activeStep.getOneBasedIndexSnapshot() < step.getOneBasedIndexSnapshot()) return NEVER;
      const visited = step.getVisitedSnapshot();
      if (visited) {
        // User can always navigate to previously visited steps
        step.setVisited(true);
        this._activeStep$.next(step);
        return NEVER;
      }
      // If step was not visited it's in front of us.
      // Because this is a linear stepper, only the next step can be now visited
      return step.previous$.pipe(
        take(1),
        switchMap(previousStep => {
          // This checks for the first step (it has no previous step)
          // but the first step gets always handled in the if and not in this else (is by default visited)
          if (previousStep === null) return NEVER;

          // Handles steps that are after a visited step, that is also completed
          return previousStep.visited$.pipe(
            take(1),
            switchMap(visited => {
              return previousStep.valid$.pipe(
                take(1),
                tap(valid => {
                  if (visited && valid) {
                    step.setVisited(true);
                    this._activeStep$.next(step);
                  }
                })
              );
            })
          );
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

  public addStep(step: StepperStep): void {
    if (this._firstStep$.value === null) {
      this._firstStep$.next(step);
      this._lastStep$.next(step);
      this._activeStep$.next(step);
      step.setVisited(true);
      step.setOneBasedIndex(1);
    } else if (this._lastStep$.value !== null) {
      const currentLastStep = this._lastStep$.value;
      currentLastStep.setNextStep(step);
      step.setPreviousStep(currentLastStep);
      step.setOneBasedIndex(currentLastStep.getOneBasedIndexSnapshot() + 1);
      this._lastStep$.next(step);
    }
    this._length$.next(this._length$.value + 1);
    this._stepsChangedAction$.next();
  }

  public ngOnDestroy(): void {
    this._destroyAction$.next();
    this._destroyAction$.complete();
  }
}
