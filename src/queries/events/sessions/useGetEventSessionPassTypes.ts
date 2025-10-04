import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "PASS_TYPES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPassTypes>>
) => {
  client.setQueryData(
    EVENT_SESSION_PASS_TYPES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionPassTypesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPassTypes = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionPassTypesProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/passTypes`,
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
export const useGetEventSessionPassTypes = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionPassTypes>>
  >(
    EVENT_SESSION_PASS_TYPES_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionPassTypes({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    }
  );
};
