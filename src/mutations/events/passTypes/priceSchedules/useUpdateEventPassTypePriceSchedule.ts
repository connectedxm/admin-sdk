import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypePriceScheduleUpdateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedule";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedules";

/**
 * @category Params
 * @group Events
 */
interface UpdateEventPassTypePriceScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
  schedule: PassTypePriceScheduleUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventPassTypePriceSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypePriceScheduleParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
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

/**
 * @category Mutations
 * @group Events
 */
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
