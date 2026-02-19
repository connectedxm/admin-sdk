import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TIERS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface AddEventSessionTierParams extends MutationParams {
  eventId: string;
  sessionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const AddEventSessionTier = async ({
  eventId,
  sessionId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventSessionTierParams): Promise<ConnectedXMResponse<EventSession>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIERS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useAddEventSessionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionTier>>,
      Omit<AddEventSessionTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionTierParams,
    Awaited<ReturnType<typeof AddEventSessionTier>>
  >(AddEventSessionTier, options);
};
