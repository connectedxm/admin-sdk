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

/**
 * Fetches price schedule details for a specific event pass type.
 * This function is designed to retrieve detailed information about the price schedule associated with a particular event pass type.
 * It is useful in scenarios where precise pricing information is required for event management or ticketing systems.
 * @name GetEventPassTypePriceSchedule
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @param {string} scheduleId - The id of the schedule
 * @version 1.2
 **/

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