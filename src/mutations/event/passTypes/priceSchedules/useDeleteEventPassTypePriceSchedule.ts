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
import { EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_KEY } from "@src/queries";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedules";

/**
 * Endpoint to delete a price schedule for a specific event and pass type.
 * This function allows the removal of a price schedule associated with a given event and pass type.
 * It is designed to be used in scenarios where an event's pricing structure needs to be updated or corrected.
 * @name DeleteEventPassTypePriceSchedule
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @param {string} scheduleId - The id of the schedule
 * @version 1.2
 **/
interface DeleteEventPassTypePriceScheduleParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  scheduleId: string;
}

export const DeleteEventPassTypePriceSchedule = async ({
  eventId,
  passTypeId,
  scheduleId,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypePriceScheduleParams): Promise<
  ConnectedXMResponse<EventPassTypePriceSchedule>
> => {
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
