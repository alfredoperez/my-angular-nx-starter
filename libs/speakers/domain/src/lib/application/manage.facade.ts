import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Speaker } from '../entities/speaker';
import { SpeakerDataService } from '../infrastructure/speaker.data.service';

@Injectable({ providedIn: 'root' })
export class ManageFacade {

  private speakerListSubject = new BehaviorSubject<Speaker[]>([]);
  speakerList$ = this.speakerListSubject.asObservable();

  constructor(private speakerDataService: SpeakerDataService) {
  }

  load(): void {

  }

}
