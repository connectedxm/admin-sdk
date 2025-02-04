import {
  ConnectedXMResponse,
  EventPassTypePriceSchedule,
} from "@src/interfaces";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "./useGetEventPassTypePriceSchedules";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY = (
  eventId: string,
  passTypeId: string,
  scheduleId: string
) => [
  ...EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(eventId, passTypeId),
  scheduleId,
];

export const SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypePriceSchedule>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypePriceScheduleParams extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

/**
 * @category Queries
 * @group Events
 **/
export const GetEventPassTypePriceSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  adminApiParams,
}: GetEventPassTypePriceScheduleParams): Promise<
  ConnectedXMResponse<EventPassTypePriceSchedule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/priceSchedules/${scheduleId}`
  );
  return data;
};

export const useGetEventPassTypePriceSchedule = (
  eventId: string = "",
  passTypeId: string = "",
  scheduleId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassTypePriceSchedule>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassTypePriceSchedule>
  >(
    EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY(eventId, passTypeId, scheduleId),
    (params: SingleQueryParams) =>
      GetEventPassTypePriceSchedule({
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
