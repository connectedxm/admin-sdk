import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionAccess,
  PurchaseStatus,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ACCESSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  purchaseStatus?: keyof typeof PurchaseStatus
) => {
  const baseKey = [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "PASSES"];
  return purchaseStatus !== undefined ? [...baseKey, purchaseStatus] : baseKey;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ACCESSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_ACCESSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionAccesses>>
) => {
  client.setQueryData(EVENT_SESSION_ACCESSES_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionAccessesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  purchaseStatus?: keyof typeof PurchaseStatus;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionAccesses = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  purchaseStatus,
  adminApiParams,
}: GetEventSessionAccessesProps): Promise<
  ConnectedXMResponse<EventSessionAccess[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/accesses`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        purchaseStatus: purchaseStatus || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionAccesses = (
  eventId: string = "",
  sessionId: string = "",
  purchaseStatus?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionAccesses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionAccesses>>
  >(
    EVENT_SESSION_ACCESSES_QUERY_KEY(eventId, sessionId, purchaseStatus),
    (params: InfiniteQueryParams) =>
      GetEventSessionAccesses({
        ...params,
        eventId,
        sessionId,
        purchaseStatus,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};
