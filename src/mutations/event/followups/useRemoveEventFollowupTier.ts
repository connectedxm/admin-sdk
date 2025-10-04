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
export interface RemoveEventFollowupTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  followupId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const RemoveEventFollowupTier = async ({
  allowed,
  eventId,
  followupId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventFollowupTierParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}/tiers/${tierId}`, {
    params: {
      allowed,
    },
  });
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
export const useRemoveEventFollowupTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventFollowupTier>>,
      Omit<RemoveEventFollowupTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventFollowupTierParams,
    Awaited<ReturnType<typeof RemoveEventFollowupTier>>
  >(RemoveEventFollowupTier, options);
};
