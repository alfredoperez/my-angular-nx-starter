import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  standalone: true,
  imports: [RouterModule, AngularQueryDevtools],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
})
export class AppComponent {}
