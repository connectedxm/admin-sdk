import {
  ConnectedXMResponse,
  EventPassTypeRefundSchedule,
} from "@src/interfaces";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "./useGetEventPassTypeRefundSchedules";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches refund schedule details for a specific event pass type.
 * This function is designed to retrieve detailed information about the refund schedule associated with a particular event pass type.
 * It is useful for applications that need to display or process refund schedule data for event management.
 * @name GetEventPassTypeRefundSchedule
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @param {string} scheduleId - The id of the refund schedule
 * @version 1.2
 **/

export const EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY = (
  eventId: string,
  passTypeId: string,
  scheduleId: string
) => [
  ...EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(eventId, passTypeId),
  scheduleId,
];

export const SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeRefundSchedule>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeRefundScheduleParams extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

export const GetEventPassTypeRefundSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  adminApiParams,
}: GetEventPassTypeRefundScheduleParams): Promise<
  ConnectedXMResponse<EventPassTypeRefundSchedule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/refundSchedules/${scheduleId}`
  );
  return data;
};

export const useGetEventPassTypeRefundSchedule = (
  eventId: string = "",
  passTypeId: string = "",
  scheduleId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassTypeRefundSchedule>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassTypeRefundSchedule>
  >(
    EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY(eventId, passTypeId, scheduleId),
    (params: SingleQueryParams) =>
      GetEventPassTypeRefundSchedule({
        eventId,
        passTypeId,
        scheduleId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!passTypeId && !!scheduleId,
    }
  );
};