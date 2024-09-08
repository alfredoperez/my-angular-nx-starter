import { inject, Signal } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient, keepPreviousData } from '@tanstack/angular-query-experimental';
import { SpeakerDataService } from './speaker.data.service';
import { Speaker } from '../entities/speaker';
import { RequestOptions } from '@my/shared/util-api';

/**
 * Represents the
 */
const entityName = 'speaker';

/**
 * This is used to generate th
 */
export const queryKeys = {
  all: () => [entityName],
  list: (requestOptions?: RequestOptions) => [
    entityName,
    'list',
    requestOptions
  ],
  details: (id: Speaker['id']) => [entityName, 'details', id]
};

const queryOptions = {
  staleTime: 1000 * 5,
  gcTime: 1000 * 120
};

function pageQuery(requestOptions: Signal<RequestOptions>) {
  const speakerData = inject(SpeakerDataService);

  return injectQuery(() => ({
    queryKey: queryKeys.list(requestOptions()),
    queryFn: () => speakerData.fetchPage(requestOptions()),
    placeholderData: keepPreviousData,
    ...queryOptions
  }));
}

function prefetchNextPageQuery(requestOptions: Signal<RequestOptions>) {
  const speakerData = inject(SpeakerDataService);
  const queryClient = injectQueryClient();

  return {
    prefetch: () => {
      const currentPage = requestOptions().pagination?.page || 1;

      const options = {
        ...requestOptions(),
        pagination: {
          ...requestOptions().pagination,
          page: currentPage + 1
        }
      };
      return queryClient.prefetchQuery({
        queryKey: queryKeys.list(options),
        queryFn: () => speakerData.fetchPage(options)
      });
    }
  };
}

function detailsQuery(id: Signal<Speaker['id']>) {
  const targetId = id();
  if (!targetId || targetId === '') {
    return;
  }
  const speakerData = inject(SpeakerDataService);
  return injectQuery(() => ({
    queryKey: queryKeys.details(id()),
    queryFn: () => speakerData.fetchById(id()),
    ...queryOptions
  }));
}

function addMutation() {
  const speakerData = inject(SpeakerDataService);
  const queryClient = injectQueryClient();

  return injectMutation(() => {
    return {
      mutationKey: ['addUser'],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all() });
      },
      mutationFn: (speaker: Speaker) => speakerData.create(speaker)
    };
  });
}

function updateMutation(speaker: Signal<Speaker>) {
  const speakerData = inject(SpeakerDataService);
  const queryClient = injectQueryClient();

  return injectMutation(() => {
    return {
      // TODO: Modify this to be automatically generated
      mutationKey: ['updateSpeaker'],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all() });
      },
      mutationFn: () => {
        return speakerData.update(speaker().id, speaker());
      }
    };
  });
}

function deleteMutation(speaker: Signal<Speaker>) {
  const speakerData = inject(SpeakerDataService);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationKey: ['deleteSpeaker'],
    mutationFn: () => speakerData.delete(speaker().id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
      queryClient.removeQueries({ queryKey: queryKeys.details(speaker().id) });
    }
  }));
}

export const speakerQuery = {
  page: pageQuery,
  details: detailsQuery,
  prefetchNextPage: prefetchNextPageQuery,
  delete: deleteMutation,
  add: addMutation,
  update: updateMutation
};
