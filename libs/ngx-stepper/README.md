# NgxStepper

> An Angular stepper based on RxJS, which provides various events to make development easier.
> This library has no dependencies except for Angular and RxJS

It contains a ready to use stepper implementation as well as the possibility to create your own stepper with a
development kit (similar to the Angular Material Stepper).

## Usage

`app.component.html`

```html

<ngx-stepper #stepper>
  <ngx-stepper-step label="First step">
    First step content
    <button (click)="stepper.next()">Continue</button>
  </ngx-stepper-step>
  <ngx-stepper-step label="Second step" [valid]="stepValid">
    Step valid:
    <input type="checkbox" [(ngModel)]="stepValid" />
    <button (click)="stepper.previous()">Back</button>
    <button (click)="stepper.next()">Continue</button>
  </ngx-stepper-step>
  <ngx-stepper-step label="Third step">
    Third step content
    <button (click)="stepper.previous()">Back</button>
    <button (click)="stepper.next()">Continue</button>
  </ngx-stepper-step>
</ngx-stepper>
```

`app.component.ts`

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public stepValid = false;
}
```

`app.module.ts`

```typescript
import { NgxStepperModule } from '@valentingavran/ngx-stepper';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, // Default app module import
    BrowserAnimationsModule, // Required for stepper animations
    NgxStepperModule, // Modulte that contains the stepper
    FormsModule, // Only required for the validation in this example
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
```

## API

### ngx-stepper

#### Props

| Name               | Type    | Default | Description                                                                                    |
|--------------------|---------|---------|------------------------------------------------------------------------------------------------|
| stepConnectionLine | boolean | true    | Activates or deactivates the connection line of the stepper, which is visible at the left edge |
| headerNavigation   | boolean | true    | Activates or deactivates the navigation via the step headers                                   |

#### Events

| Name        | Type | Default | Description |
|-------------|------|---------|-------------|
| Coming soon |      |         |             |

### ngx-stepper-step

#### Props

| Name  | Type    | Default | Description                                                                                                                                     |
|-------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| label | string  | -       | Label of the step, that is displayed in the stepper header                                                                                      |
| valid | boolean | true    | With this field you can validate the current step. If the step is valid, you can navigate to the following steps. Otherwise it is not possible. |

#### Events

| Name        | Type | Default | Description |
|-------------|------|---------|-------------|
| Coming soon |      |         |             |
