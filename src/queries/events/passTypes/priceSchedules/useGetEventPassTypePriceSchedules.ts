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
 * Fetches the price schedules for a specific event pass type, allowing for pagination and filtering.
 * This function is designed to retrieve detailed pricing information for event pass types, which can be useful for event organizers and participants.
 * It supports infinite scrolling and can be integrated into applications that require dynamic data loading.
 * @name GetEventPassTypePriceSchedules
 * @param {string} eventId (path) The id of the event
 * @param {string} passTypeId (path) The id of the pass type
 * @version 1.3
 */

export const EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "PRICE_SCHEDULES"];

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
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
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
