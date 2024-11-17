import { Signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { ListResponse, RequestOptions } from '../api/entity-api.models';
import { EntityApiService } from '../api/entity-api.service';

export interface EntityWithId {
  id: string;
}

export function createEntityQueries<T extends EntityWithId>(
  entityName: string,
) {
  const queryKeys = {
    all: () => [entityName],
    list: (requestOptions?: RequestOptions) => [
      entityName,
      'list',
      requestOptions,
    ],
    details: (id: T['id']) => [entityName, 'details', id],
  };

  const queryOptions = {
    staleTime: 1000 * 5,
    gcTime: 1000 * 120,
  };

  return (apiService: EntityApiService<T>) => {
    const queryClient = injectQueryClient();

    const invalidateAll = () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });

    return {
      list: (requestOptions: Signal<RequestOptions>) =>
        injectQuery(() => ({
          queryKey: queryKeys.list(requestOptions()),
          queryFn: () => apiService.getList(requestOptions()),
          placeholderData: keepPreviousData,
          ...queryOptions,
        })),

      prefetchNextPage: (requestOptions: Signal<RequestOptions>) => ({
        execute: () => {
          const currentPage = requestOptions().pagination?.page || 1;
          const nextPageOptions = {
            ...requestOptions(),
            pagination: {
              ...requestOptions().pagination,
              page: currentPage + 1,
            },
          };
          return queryClient.prefetchQuery({
            queryKey: queryKeys.list(nextPageOptions),
            queryFn: () => apiService.getList(nextPageOptions),
          });
        },
      }),

      details: (id: Signal<T['id']>) =>
        injectQuery(() => ({
          queryKey: queryKeys.details(id()),
          queryFn: () => apiService.getById(id()),
          initialData: () =>
            queryClient
              .getQueryData<ListResponse<T>>([entityName])
              ?.items.find(item => item.id === id()),
          enabled: !!id() && id() !== '',
          ...queryOptions,
        })),

      create: () =>
        injectMutation(() => ({
          mutationFn: (entity: Partial<T>) => apiService.create(entity),
          onSuccess: invalidateAll,
        })),

      update: () =>
        injectMutation(() => ({
          mutationFn: ({ id, entity }: { id: string; entity: Partial<T> }) =>
            apiService.update(id, entity),
          onSuccess: invalidateAll,
        })),

      remove: () =>
        injectMutation(() => ({
          mutationFn: (id: string) => apiService.remove(id),
          onSuccess: invalidateAll,
        })),
    };
  };
}
