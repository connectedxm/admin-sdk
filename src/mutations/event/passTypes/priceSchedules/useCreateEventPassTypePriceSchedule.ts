import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypePriceScheduleCreateInputs } from "@src/params";
import { SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedule";
import { EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY } from "@src/queries/events/passTypes/priceSchedules/useGetEventPassTypePriceSchedules";

/**
 * @category Params
 * @group Events
 */
interface CreateEventPassTypePriceScheduleParams extends MutationParams {
  eventId: string;
  passTypeid: string;
  schedule: PassTypePriceScheduleCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventPassTypePriceSchedule = async ({
  eventId,
  passTypeid,
  schedule,
  adminApiParams,
  queryClient,
}: CreateEventPassTypePriceScheduleParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/events/${eventId}/passTypes/${passTypeid}/priceSchedules`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_PRICE_SCHEDULES_QUERY_KEY(eventId, passTypeid),
    });
    SET_EVENT_PASS_TYPE_PRICE_SCHEDULE_QUERY_DATA(
      queryClient,
      [eventId, passTypeid, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventPassTypePriceSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassTypePriceSchedule>>,
      Omit<
        CreateEventPassTypePriceScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassTypePriceScheduleParams,
    Awaited<ReturnType<typeof CreateEventPassTypePriceSchedule>>
  >(CreateEventPassTypePriceSchedule, options);
};
