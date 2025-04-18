import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_SESSION_PASSES_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "SESSION_PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_SESSION_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_SESSION_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassSessionPasses>>
) => {
  client.setQueryData(
    EVENT_PASS_SESSION_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassSessionPassesProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassSessionPasses = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassSessionPassesProps): Promise<
  ConnectedXMResponse<EventSessionPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/sessionPasses`,
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
export const useGetEventPassSessionPasses = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassSessionPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassSessionPasses>>
  >(
    EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassSessionPasses({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};
