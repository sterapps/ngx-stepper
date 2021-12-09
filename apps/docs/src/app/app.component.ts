import { Component } from '@angular/core';

@Component({
  selector: 'ngx-stepper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public stepValid = false;
  public visible = true;
}
