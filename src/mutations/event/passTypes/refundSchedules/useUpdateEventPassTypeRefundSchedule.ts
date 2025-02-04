import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypeRefundScheduleUpdateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_REFUND_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedule";
import { EVENT_PASS_TYPE_REFUND_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/refundSchedules/useGetEventPassTypeRefundSchedules";

/**
 * @category Params
 * @group Events
 */
interface UpdateEventPassTypeRefundScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
  schedule: PassTypeRefundScheduleUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventPassTypeRefundSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypeRefundScheduleParams) => {
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

/**
 * @category Mutations
 * @group Events
 */
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
