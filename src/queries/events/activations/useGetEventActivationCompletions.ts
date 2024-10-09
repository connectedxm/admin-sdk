import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ActivationCompletion } from "@src/interfaces";
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
export const EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId), "COMPLETIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACTIVATION_COMPLETIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationCompletions>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationCompletionsProps extends InfiniteQueryParams {
  eventId: string;
  activationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventActivationCompletions = async ({
  eventId,
  activationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventActivationCompletionsProps): Promise<
  ConnectedXMResponse<ActivationCompletion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/completions`,
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
export const useGetEventActivationCompletions = (
  eventId: string = "",
  activationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivationCompletions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationCompletions>>
  >(
    EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    (params: InfiniteQueryParams) =>
      GetEventActivationCompletions({
        eventId,
        activationId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!activationId && (options.enabled ?? true),
    },
    "events"
  );
};
