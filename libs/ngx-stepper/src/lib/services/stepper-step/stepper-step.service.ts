import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Stepper } from '../stepper/stepper.service';

@Injectable()
export class StepperStep implements OnDestroy {
  public constructor(protected stepper: Stepper) {}

  private readonly _isFirstStep$ = new BehaviorSubject<boolean>(false);
  public readonly isFirstStep$ = this._isFirstStep$.asObservable().pipe(shareReplay(1));

  private readonly _isLastStep$ = new BehaviorSubject<boolean>(false);
  public readonly isLastStep$ = this._isLastStep$.asObservable();

  private readonly _label$ = new BehaviorSubject<string>('');
  public readonly label$ = this._label$.asObservable().pipe(shareReplay(1));

  private readonly _visited$ = new BehaviorSubject(false);
  public readonly visited$ = this._visited$.asObservable().pipe(shareReplay(1));

  private readonly _oneBasedIndex$ = new BehaviorSubject<number>(-1);
  public readonly oneBasedIndex$ = this._oneBasedIndex$.asObservable();

  private readonly _valid$ = new BehaviorSubject(true);
  public readonly valid$ = this._valid$.asObservable().pipe(shareReplay(1));

  private readonly _active$ = new BehaviorSubject(false);
  public readonly active$ = this._active$.asObservable().pipe(shareReplay(1));

  public setLabel(label: string): void {
    this._label$.next(label);
  }

  public getLabelSnapshot(): string {
    return this._label$.value;
  }

  public setVisited(visited: boolean): void {
    this._visited$.next(visited);
  }

  public getVisitedSnapshot(): boolean {
    return this._visited$.value;
  }

  public setIsFirstStep(value: boolean): void {
    this._isFirstStep$.next(value);
  }

  public setISLastStep(value: boolean): void {
    this._isLastStep$.next(value);
  }

  public setOneBasedIndex(index: number): void {
    this._oneBasedIndex$.next(index);
  }

  public getOneBasedIndexSnapshot(): number {
    return this._oneBasedIndex$.value;
  }

  public setValid(valid: boolean): void {
    this._valid$.next(valid);
  }

  public getValidSnapshot(): boolean {
    return this._valid$.value;
  }

  public setActive(active: boolean): void {
    this._active$.next(active);
    if (active) this._visited$.next(true);
  }

  public getActiveSnapshot(): boolean {
    return this._active$.value;
  }

  public ngOnDestroy(): void {
    this.stepper.removeStep(this);
  }
}
