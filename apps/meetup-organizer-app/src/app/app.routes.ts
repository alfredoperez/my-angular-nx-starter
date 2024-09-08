import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'speakers'
  },
  {
    path: '',
    children: [
      {
        path: 'speakers',
        loadChildren: () =>
          import('@my/speakers/feature-manage').then(
            (m) => m.SPEAKERS_ROUTES
          )
      }
    ]
  }
];
