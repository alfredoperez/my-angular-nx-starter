import { Injectable } from '@angular/core';
import { ApiService } from '@my/shared/util-api';
import { Speaker } from '../entities/speaker';

@Injectable({ providedIn: 'root' })
export class SpeakerDataService extends ApiService<Speaker> {
  constructor() {
    super('speakers');
  }
}
