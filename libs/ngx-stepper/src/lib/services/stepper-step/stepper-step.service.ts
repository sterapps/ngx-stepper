import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class StepperStep {
  private readonly _previous$ = new BehaviorSubject<StepperStep | null>(null);
  public readonly previous$ = this._previous$.asObservable();

  private readonly _next$ = new BehaviorSubject<StepperStep | null>(null);
  public readonly next$ = this._next$.asObservable().pipe(shareReplay(1));

  private readonly _label$ = new BehaviorSubject<string>('');
  public readonly label$ = this._label$.asObservable().pipe(shareReplay(1));

  private readonly _visited$ = new BehaviorSubject(false);
  public readonly visited$ = this._visited$.asObservable().pipe(shareReplay(1));

  private readonly _oneBasedIndex$ = new BehaviorSubject<number>(-1);
  public readonly oneBasedIndex$ = this._oneBasedIndex$.asObservable().pipe(shareReplay(1));

  private readonly _valid$ = new BehaviorSubject(true);
  public readonly valid$ = this._valid$.asObservable().pipe(shareReplay(1));

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

  public setPreviousStep(nextStep: StepperStep | null): void {
    this._previous$.next(nextStep);
  }

  public setNextStep(nextStep: StepperStep | null): void {
    this._next$.next(nextStep);
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
}
