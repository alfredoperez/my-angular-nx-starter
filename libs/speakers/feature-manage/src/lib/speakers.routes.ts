import { Routes } from '@angular/router';
import { EditSpeakerPageComponent } from './edit-speaker-page/edit-speaker-page.component';
import { ManageSpeakersPageComponent } from './manage-speakers-page/manage-speakers-page.component';

export const SPEAKERS_ROUTES: Routes = [
  {
    path: '',
    component: ManageSpeakersPageComponent,
  },
  {
    path: ':id',
    component: EditSpeakerPageComponent,
  },
];

export default SPEAKERS_ROUTES;
