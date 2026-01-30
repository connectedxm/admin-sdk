import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_TIERS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface AddEventFollowupTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  followupId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const AddEventFollowupTier = async ({
  allowed,
  eventId,
  followupId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventFollowupTierParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/followups/${followupId}/tiers/${tierId}`,
    {
      allowed,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_TIERS_QUERY_KEY(allowed, eventId, followupId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(queryClient, [eventId, followupId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useAddEventFollowupTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventFollowupTier>>,
      Omit<AddEventFollowupTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventFollowupTierParams,
    Awaited<ReturnType<typeof AddEventFollowupTier>>
  >(AddEventFollowupTier, options);
};
