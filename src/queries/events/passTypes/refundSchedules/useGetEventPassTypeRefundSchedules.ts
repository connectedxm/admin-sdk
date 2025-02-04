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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "REFUND_SCHEDULES"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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

/**
 * @category Hooks
 * @group Events
 */
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
