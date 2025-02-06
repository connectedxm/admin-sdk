import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "../useGetEventPassType";
import {
  ConnectedXMResponse,
  EventPassTypeRefundSchedule,
} from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches refund schedules for a specific event pass type with support for pagination and filtering.
 * This function is designed to retrieve detailed refund schedule information for a given event pass type,
 * allowing for efficient data handling and display in applications that require such data.
 * @name GetEventPassTypeRefundSchedules
 * @param {string} eventId (path) The id of the event
 * @param {string} passTypeId (path) The id of the pass type
 * @version 1.3
 **/

export const EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "REFUND_SCHEDULES"];

export const SET_EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeRefundSchedules>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeRefundSchedulesParams extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

export const GetEventPassTypeRefundSchedules = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  passTypeId,
  adminApiParams,
}: GetEventPassTypeRefundSchedulesParams): Promise<
  ConnectedXMResponse<EventPassTypeRefundSchedule[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/refundSchedules`,
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

export const useGetEventPassTypeRefundSchedules = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypeRefundSchedules>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypeRefundSchedules>>
  >(
    EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypeRefundSchedules({ ...params, eventId, passTypeId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId,
    }
  );
};
