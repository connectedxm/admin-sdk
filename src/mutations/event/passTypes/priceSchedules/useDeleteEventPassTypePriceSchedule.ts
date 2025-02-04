import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY } from "@src/queries";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedules";

/**
 * @category Params
 * @group Events
 */
interface DeleteEventPassTypePriceScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventPassTypePriceSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypePriceScheduleParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/passTypes/${passTypeId}/priceSchedules/${scheduleId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(eventId, passTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY(
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
export const useDeleteEventPassTypePriceSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassTypePriceSchedule>>,
      Omit<
        DeleteEventPassTypePriceScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypePriceScheduleParams,
    Awaited<ReturnType<typeof DeleteEventPassTypePriceSchedule>>
  >(DeleteEventPassTypePriceSchedule, options);
};
