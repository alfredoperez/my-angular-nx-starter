import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { RowClickedEvent } from 'ag-grid-community';
import { DataViewerStore } from '@my/shared/util-data-viewer-store';
import { Speaker, useSpeakerQuery } from '@my/speakers/domain';
import { ButtonComponent } from './button/button.component';
import { columnDefs } from './manage-speakers-page.models';

@Component({
  standalone: true,
  imports: [CommonModule, AgGridAngular, ButtonComponent],
  providers: [DataViewerStore],
  templateUrl: 'manage-speakers-page.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 93%;
      }

      ag-grid-angular {
        height: 93%;
        min-height: 300px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSpeakersPageComponent {
  store = inject(DataViewerStore);
  private query = useSpeakerQuery();

  speakerQuery = this.query.list(this.store.requestOptions);
  prefetchNextPage = this.query.prefetchNextPage(this.store.requestOptions);

  protected readonly columnDefs = columnDefs;
  #router = inject(Router);

  constructor() {
    effect(() => {
      if (
        !this.speakerQuery.isPlaceholderData() &&
        this.speakerQuery.data()?.hasMore
      ) {
        this.prefetchNextPage.execute();
      }
    });
  }

  public onAddUser() {
    // todo: this.#modalService.open(AddUserModalComponent, DefaultOptions);
  }

  public onSpeakerClicked(event: RowClickedEvent<Speaker>) {
    if (!event.data) {
      return;
    }
    this.#router.navigate(['/speakers', event.data.id]);
  }

  // onChangePage(pageEvent) {
  //   this.store.setPage(pageEvent.pageIndex);
  // }

  onSort() {
    // TODO: need to implement this
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(value);
  }
}
