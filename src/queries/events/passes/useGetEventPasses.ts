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
export const EVENT_PASSES_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
) => {
  const key = [...EVENT_QUERY_KEY(eventId), "PASSES"];
  if (checkedIn) {
    key.push("CHECKED_IN");
  }
  return key;
};

interface GetEventPassesProps extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPasses = async ({
  eventId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passes`, {
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
export const useGetEventPasses = (
  eventId: string = "",
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventPasses>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventPasses>>>(
    EVENT_PASSES_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetEventPasses({
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
