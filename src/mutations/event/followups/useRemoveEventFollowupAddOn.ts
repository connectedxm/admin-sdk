import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_ADDONS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface RemoveEventFollowupAddOnParams extends MutationParams {
  eventId: string;
  followupId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const RemoveEventFollowupAddOn = async ({
  eventId,
  followupId,
  addOnId,
  adminApiParams,
  queryClient,
}: RemoveEventFollowupAddOnParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}/addOns/${addOnId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_ADDONS_QUERY_KEY(eventId, followupId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(queryClient, [eventId, followupId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useRemoveEventFollowupAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventFollowupAddOn>>,
      Omit<RemoveEventFollowupAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventFollowupAddOnParams,
    Awaited<ReturnType<typeof RemoveEventFollowupAddOn>>
  >(RemoveEventFollowupAddOn, options, {
    domain: "events",
    type: "update",
  });
};
