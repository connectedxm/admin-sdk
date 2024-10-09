import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "../useGetEventPassType";
import {
  ConnectedXMResponse,
  EventPassTypePriceSchedule,
} from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "PRICE_SCHEDULES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypePriceSchedules>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypePriceSchedulesParams extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassTypePriceSchedules = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  passTypeId,
  adminApiParams,
}: GetEventPassTypePriceSchedulesParams): Promise<
  ConnectedXMResponse<EventPassTypePriceSchedule[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get(
    `/events/${eventId}/passTypes/${passTypeId}/priceSchedules`,
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
export const useGetEventPassTypePriceSchedules = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypePriceSchedules>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypePriceSchedules>>
  >(
    EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypePriceSchedules({ ...params, eventId, passTypeId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId,
    }
  );
};
