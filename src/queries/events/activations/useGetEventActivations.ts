import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves a list of event activations with support for pagination and filtering.
 * This function is designed to fetch event activations associated with a specific event ID.
 * It is useful for applications that need to display or process event activations in a paginated format.
 * @name GetEventActivations
 * @param {string} eventId (path) The ID of the event
 * @version 1.3
 **/

export const EVENT_ACTIVATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ACTIVATIONS",
];

export const SET_EVENT_ACTIVATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivations>>
) => {
  client.setQueryData(EVENT_ACTIVATIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventActivationsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventActivations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventActivationsProps): Promise<
  ConnectedXMResponse<EventActivation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/activations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventActivations = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivations>>
  >(
    EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventActivations({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
