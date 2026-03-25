import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PENDING_PASSES_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
) => {
  const key = [...EVENT_QUERY_KEY(eventId), "PASSES", "PENDING"];
  if (typeof checkedIn === "boolean") {
    key.push(checkedIn ? "CHECKED_IN" : "NOT_CHECKED");
  }
  return key;
};

interface GetEventPendingPassesProps extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPendingPasses = async ({
  eventId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPendingPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passes/pending`, {
    params: {
      checkedIn: typeof checkedIn !== "undefined" ? checkedIn : undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPendingPasses = (
  eventId: string = "",
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPendingPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPendingPasses>>
  >(
    EVENT_PENDING_PASSES_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetEventPendingPasses({
        ...params,
        eventId,
        checkedIn,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
