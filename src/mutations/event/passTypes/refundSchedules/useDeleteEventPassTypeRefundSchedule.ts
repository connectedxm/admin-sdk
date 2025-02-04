import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedules";

/**
 * @category Params
 * @group Events
 */
interface DeleteEventPassTypeRefundScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

/**
 * @category Methods
 * @group Events
 */
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

/**
 * @category Mutations
 * @group Events
 */
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
