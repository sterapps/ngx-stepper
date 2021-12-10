import { Component } from '@angular/core';

@Component({
  selector: 'ngx-stepper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public stepValid = false;
  public visible = true;

  public onPrevious(): void {
    console.log('on previous fired');
  }

  public onNext(): void {
    console.log('on next fired');
  }

  public onActiveStateChange(event: boolean): void {
    console.log(event);
  }
}
