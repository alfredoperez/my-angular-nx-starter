import { inject } from '@angular/core';
import { createEntityQueries } from '@my/shared/util-api';
import { Speaker } from '../entities/speaker';
import { SpeakerDataService } from './speaker.data.service';

export function useSpeakerQuery() {
  const speakerDataService = inject(SpeakerDataService);
  return createEntityQueries<Speaker>('speaker')(speakerDataService);
}