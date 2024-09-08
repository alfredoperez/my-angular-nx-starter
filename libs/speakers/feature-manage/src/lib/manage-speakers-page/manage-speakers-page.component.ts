import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DataViewerStore } from '@my/shared/util-data-viewer-store';
import { ButtonComponent, ModalService } from '@ui-alfie';
import { AgGridAngular } from 'ag-grid-angular';
import { RowClickedEvent } from 'ag-grid-community';
import { Speaker, speakerQuery } from '../../../../domain/src';
import { columnDefs } from './manage-speakers-page.models';

@Component({
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatPaginator, ButtonComponent],
  providers: [DataViewerStore],
  templateUrl: 'manage-speakers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageSpeakersPageComponent {
  // injects
  store = inject(DataViewerStore);
  // signals
  speakerQuery = speakerQuery.page(this.store.requestOptions);
  users = computed(() => this.speakerQuery.data()?.items || []);
  totalItems = computed(() => this.speakerQuery.data()?.total || 0);
  isPlaceholderData = this.speakerQuery.isPlaceholderData;
  prefetchNextPage = speakerQuery.prefetchNextPage(this.store.requestOptions);
  // props
  protected readonly columnDefs = columnDefs;
  #modalService = inject(ModalService);
  #router = inject(Router);

  constructor() {
    effect(() => {
      if (
        !this.speakerQuery.isPlaceholderData() &&
        this.speakerQuery.data()?.hasMore
      ) {
        this.prefetchNextPage.prefetch();
      }
    });
  }

  public addUser() {
    // this.#modalService.open(AddUserModalComponent, DefaultOptions);
  }

  public handleRowClicked(event: RowClickedEvent<Speaker>) {
    if (!event.data) {
      return;
    }
    this.#router.navigate(['/users', event.data.id]);
  }

  // handleCurrentPageChange(page: number) {
  //   this.store.setPage(page);
  // }

  handleCurrentPageChange(pageEvent: PageEvent) {
    this.store.setPage(pageEvent.pageIndex);
  }

  handleSortChanged() {
    // TODO: need to implement this
  }

  handleSearchQueryChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(value);
  }
}

