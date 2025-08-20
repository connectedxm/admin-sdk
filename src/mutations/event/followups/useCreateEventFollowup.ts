import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationFollowup, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFollowupCreateInputs } from "@src/params";
import {
  EVENT_FOLLOWUPS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface CreateEventFollowupParams extends MutationParams {
  eventId: string;
  followup: EventFollowupCreateInputs;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const CreateEventFollowup = async ({
  eventId,
  followup,
  adminApiParams,
  queryClient,
}: CreateEventFollowupParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups`, followup);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUPS_QUERY_KEY(eventId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(
      queryClient,
      [eventId, data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useCreateEventFollowup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFollowup>>,
      Omit<CreateEventFollowupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFollowupParams,
    Awaited<ReturnType<typeof CreateEventFollowup>>
  >(CreateEventFollowup, options, {
    domain: "events",
    type: "update",
  });
};
