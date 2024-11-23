import { Injectable } from '@angular/core';
import { EntityApiService } from '@my/shared/util-api';
import { Speaker } from '../entities/speaker';

@Injectable({ providedIn: 'root' })
export class SpeakerDataService extends EntityApiService<Speaker> {
  constructor() {
    super('speakers');
  }
}
