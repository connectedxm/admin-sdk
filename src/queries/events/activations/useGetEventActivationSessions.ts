import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ACTIVATION_QUERY_KEY } from "./useGetEventActivation";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACTIVATION_SESSIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId), "SESSIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACTIVATION_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationSessions>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_SESSIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationSessionsProps extends InfiniteQueryParams {
  eventId: string;
  activationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventActivationSessions = async ({
  eventId,
  activationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventActivationSessionsProps): Promise<
  ConnectedXMResponse<EventSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/sessions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventActivationSessions = (
  eventId: string = "",
  activationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivationSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationSessions>>
  >(
    EVENT_ACTIVATION_SESSIONS_QUERY_KEY(eventId, activationId),
    (params: InfiniteQueryParams) =>
      GetEventActivationSessions({
        ...params,
        eventId,
        activationId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!activationId && (options.enabled ?? true),
    }
  );
};
