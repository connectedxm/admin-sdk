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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get(
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
