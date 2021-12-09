import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StepperSettings {
  public readonly hasStepConnectionLine$ = new BehaviorSubject(true);
  public readonly headerNavigationEnabled$ = new BehaviorSubject(true);
}
