import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface CheckinAllAttendeePassesParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const CheckinAllAttendeePasses = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: CheckinAllAttendeePassesParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/passes/checkin/all`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useCheckinAllAttendeePasses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CheckinAllAttendeePasses>>,
      Omit<CheckinAllAttendeePassesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinAllAttendeePassesParams,
    Awaited<ReturnType<typeof CheckinAllAttendeePasses>>
  >(CheckinAllAttendeePasses, options, {
    domain: "events",
    type: "update",
  });
};
