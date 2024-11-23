import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@ui-alfie';
import { Speaker, useSpeakerQuery } from '@my/speakers/domain';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './edit-speaker-page.component.html',
  styleUrl: './edit-speaker-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSpeakerPageComponent {
  #speaker = signal({} as Speaker);
  id = input.required<string>();
  private query = useSpeakerQuery();
  speakerQuery = this.query.details(this.id);
  updateMutation = this.query.update();
  deleteMutation = this.query.remove();

  speakerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.speakerForm = this.fb.group({
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0)]],
    });

    effect(() => {
      const speaker = this.speakerQuery.data();
      if (speaker?.id) {
        this.speakerForm.patchValue({
          name: speaker.name,
          age: speaker.age,
        });
      }
    });
  }

  public onSave() {
    if (this.speakerForm === undefined || this.speakerForm.invalid) {
      return;
    }

    const { name, age } = this.speakerForm.value;
    if (!name || !age) return;

    const update = {
      ...this.#speaker(),
      name,
      age,
      updatedAt: new Date(),
    } as unknown as Speaker;

    this.#speaker.set(update);
    // this.updateMutation();
  }

  onDelete() {
    // this.deleteMutation.mutate();
    // this.handleClose();
  }
}
