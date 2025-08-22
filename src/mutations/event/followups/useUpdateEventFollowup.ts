import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationFollowup, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFollowupUpdateInputs } from "@src/params";
import {
  EVENT_FOLLOWUPS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface UpdateEventFollowupParams extends MutationParams {
  eventId: string;
  followupId: string;
  followup: EventFollowupUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const UpdateEventFollowup = async ({
  eventId,
  followupId,
  followup,
  adminApiParams,
  queryClient,
}: UpdateEventFollowupParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  if (!followupId) throw new Error("Followup ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}`, {
    ...followup,
    id: undefined,
    eventId: undefined,
    questions: undefined,
    passTypes: undefined,
    accountTiers: undefined,
    _count: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUPS_QUERY_KEY(eventId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(
      queryClient,
      [eventId, followupId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useUpdateEventFollowup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFollowup>>,
      Omit<UpdateEventFollowupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFollowupParams,
    Awaited<ReturnType<typeof UpdateEventFollowup>>
  >(UpdateEventFollowup, options, {
    domain: "events",
    type: "update",
  });
};
