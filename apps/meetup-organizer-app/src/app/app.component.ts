import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@ui-alfie';
import {MatButtonModule} from '@angular/material/button';

@Component({
  standalone: true,
  imports: [ RouterModule, ButtonComponent, MatButtonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'meetup-organizer-app';
}
