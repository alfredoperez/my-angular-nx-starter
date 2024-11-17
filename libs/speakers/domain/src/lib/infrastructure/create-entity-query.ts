import { Signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { ApiService, RequestOptions } from '@my/shared/util-api';

export interface EntityWithId {
  id: string;
}

export function createEntityQuery<T extends EntityWithId>(entityName: string) {
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

  function createQueries(apiService: ApiService<T>) {
    const queryClient = injectQueryClient();

    const invalidateAll = () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });

    const prefetch = (requestOptions: RequestOptions) => {
      const currentPage = requestOptions.pagination?.page || 1;
      const options = {
        ...requestOptions,
        pagination: { ...requestOptions.pagination, page: currentPage + 1 },
      };
      return queryClient.prefetchQuery({
        queryKey: queryKeys.list(options),
        queryFn: () => apiService.fetchPage(options),
      });
    };

    return {
      page: (requestOptions: Signal<RequestOptions>) =>
        injectQuery(() => ({
          queryKey: queryKeys.list(requestOptions()),
          queryFn: () =>
            apiService.fetchPage(requestOptions()).then((response) => {
              const { hasMore } = response;
              if (hasMore) {
                prefetch(requestOptions());
              }
              return response;
            }),
          placeholderData: keepPreviousData,

          ...queryOptions,
        })),

      prefetchNextPage: (requestOptions: Signal<RequestOptions>) => ({
        prefetch: (queryResult: CreateQueryResult<ListResponse<Entity>, Error>) => {
          const currentPage = requestOptions().pagination?.page || 1;
          const options = {
            ...requestOptions(),
            pagination: {
              ...requestOptions().pagination,
              page: currentPage + 1,
            },
          };
          return queryClient.prefetchQuery({
            queryKey: queryKeys.list(options),
            queryFn: () => apiService.fetchPage(options),
          });
        },
      }),

      details: (id: Signal<T['id']>) =>
        injectQuery(() => ({
          queryKey: queryKeys.details(id()),
          queryFn: () => apiService.fetchById(id()),
          enabled: !!id() && id() !== '',
          ...queryOptions,
        })),

      add: () =>
        injectMutation(() => ({
          mutationKey: [`add${entityName}`],
          mutationFn: (entity: T) => apiService.create(entity),
          onSuccess: invalidateAll,
        })),

      update: (entity: Signal<T>) =>
        injectMutation(() => ({
          mutationKey: [`update${entityName}`],
          mutationFn: () => apiService.update(entity().id, entity()),
          onSuccess: invalidateAll,
        })),

      delete: (entity: Signal<T>) =>
        injectMutation(() => ({
          mutationKey: [`delete${entityName}`],
          mutationFn: () => apiService.delete(entity().id),
          onSuccess: () => {
            invalidateAll();
            queryClient.removeQueries({
              queryKey: queryKeys.details(entity().id),
            });
          },
        })),
    };
  }

  return createQueries;
}
