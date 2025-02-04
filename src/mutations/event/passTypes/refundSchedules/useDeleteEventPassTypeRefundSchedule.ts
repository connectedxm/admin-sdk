import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedules";

/**
 * Endpoint to delete a refund schedule for a specific event and pass type.
 * This function allows the removal of a refund schedule associated with a particular event and pass type.
 * It is designed to be used in scenarios where refund schedules need to be managed or updated.
 * @name DeleteEventPassTypeRefundSchedule
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @param {string} scheduleId - The id of the refund schedule
 * @version 1.2
 **/
interface DeleteEventPassTypeRefundScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

export const DeleteEventPassTypeRefundSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypeRefundScheduleParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/passTypes/${passTypeId}/refundSchedules/${scheduleId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY(
        eventId,
        passTypeId,
        scheduleId
      ),
    });
  }

  return data;
};

export const useDeleteEventPassTypeRefundSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassTypeRefundSchedule>>,
      Omit<
        DeleteEventPassTypeRefundScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypeRefundScheduleParams,
    Awaited<ReturnType<typeof DeleteEventPassTypeRefundSchedule>>
  >(DeleteEventPassTypeRefundSchedule, options);
};