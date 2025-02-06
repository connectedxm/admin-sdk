import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypeRefundScheduleCreateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedule";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedules";

/**
 * Endpoint to create a refund schedule for a specific event pass type.
 * This function allows the creation of a refund schedule associated with a particular event pass type.
 * It is designed to be used in scenarios where event organizers need to define refund policies for their event pass types.
 * @name CreateEventPassTypeRefundSchedule
 * @param {string} eventId (path) - The id of the event
 * @param {string} passTypeId (path) - The id of the pass type
 * @param {PassTypeRefundScheduleCreateInputs} schedule (body) - The refund schedule inputs
 * @version 1.3
 **/
interface CreateEventPassTypeRefundScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  schedule: PassTypeRefundScheduleCreateInputs;
}

export const CreateEventPassTypeRefundSchedule = async ({
  eventId,
  passTypeId,
  schedule,
  adminApiParams,
  queryClient,
}: CreateEventPassTypeRefundScheduleParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post(
    `/events/${eventId}/passTypes/${passTypeId}/refundSchedules`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA(
      queryClient,
      [eventId, passTypeId, data.data?.id],
      data
    );
  }
  return data;
};

export const useCreateEventPassTypeRefundSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassTypeRefundSchedule>>,
      Omit<
        CreateEventPassTypeRefundScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassTypeRefundScheduleParams,
    Awaited<ReturnType<typeof CreateEventPassTypeRefundSchedule>>
  >(CreateEventPassTypeRefundSchedule, options);
};