import { Routes } from '@angular/router';
import { ManageSpeakersPageComponent } from './manage-speakers-page/manage-speakers-page.component';

export const SPEAKERS_ROUTES: Routes = [
  {
    path: '',
    component: ManageSpeakersPageComponent

  }
];

export default SPEAKERS_ROUTES;
