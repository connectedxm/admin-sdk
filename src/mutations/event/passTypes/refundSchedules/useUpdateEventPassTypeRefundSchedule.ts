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
import { PassTypeRefundScheduleUpdateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedule";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedules";

/**
 * Endpoint to update the refund schedule for a specific event pass type.
 * This function allows updating the refund schedule associated with a particular event pass type by providing the necessary schedule update inputs.
 * It is designed to be used in applications where managing event pass type refund schedules is required.
 * @name UpdateEventPassTypeRefundSchedule
 * @param {string} eventId (path) - The id of the event
 * @param {string} passTypeId (path) - The id of the pass type
 * @param {string} scheduleId (path) - The id of the schedule
 * @param {PassTypeRefundScheduleUpdateInputs} schedule (body) - The schedule update inputs
 * @version 1.3
 **/
interface UpdateEventPassTypeRefundScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
  schedule: PassTypeRefundScheduleUpdateInputs;
}

export const UpdateEventPassTypeRefundSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypeRefundScheduleParams): Promise<
  ConnectedXMResponse<EventPassTypePriceSchedule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/passTypes/${passTypeId}/refundSchedules/${scheduleId}`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.locale],
      data
    );
  }

  return data;
};

export const useUpdateEventPassTypeRefundSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassTypeRefundSchedule>>,
      Omit<
        UpdateEventPassTypeRefundScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassTypeRefundScheduleParams,
    Awaited<ReturnType<typeof UpdateEventPassTypeRefundSchedule>>
  >(UpdateEventPassTypeRefundSchedule, options);
};