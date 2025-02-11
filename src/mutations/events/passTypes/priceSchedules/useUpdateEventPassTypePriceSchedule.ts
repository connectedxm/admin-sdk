import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventPassTypePriceSchedule,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypePriceScheduleUpdateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedule";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedules";

/**
 * Endpoint to update the price schedule for a specific event pass type.
 * This function allows updating the details of a price schedule associated with a particular event pass type.
 * It is designed to be used in applications where event management and pricing updates are required.
 * @name UpdateEventPassTypePriceSchedule
 * @param {string} eventId (path) The id of the event
 * @param {string} passTypeId (path) The id of the pass type
 * @param {string} scheduleId (path) The id of the schedule
 * @param {PassTypePriceScheduleUpdateInputs} schedule (body) The schedule details to update
 * @version 1.3
 **/
interface UpdateEventPassTypePriceScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
  schedule: PassTypePriceScheduleUpdateInputs;
}

export const UpdateEventPassTypePriceSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypePriceScheduleParams): Promise<
  ConnectedXMResponse<EventPassTypePriceSchedule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/passTypes/${passTypeId}/priceSchedules/${scheduleId}`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.locale],
      data
    );
  }

  return data;
};

export const useUpdateEventPassTypePriceSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassTypePriceSchedule>>,
      Omit<
        UpdateEventPassTypePriceScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassTypePriceScheduleParams,
    Awaited<ReturnType<typeof UpdateEventPassTypePriceSchedule>>
  >(UpdateEventPassTypePriceSchedule, options);
};
