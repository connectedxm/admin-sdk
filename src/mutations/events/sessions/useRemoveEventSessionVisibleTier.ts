import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_VISIBLE_TIERS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface RemoveEventSessionVisibleTierParams extends MutationParams {
  eventId: string;
  sessionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const RemoveEventSessionVisibleTier = async ({
  eventId,
  sessionId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionVisibleTierParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/visibleTiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_VISIBLE_TIERS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useRemoveEventSessionVisibleTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionVisibleTier>>,
      Omit<
        RemoveEventSessionVisibleTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionVisibleTierParams,
    Awaited<ReturnType<typeof RemoveEventSessionVisibleTier>>
  >(RemoveEventSessionVisibleTier, options);
};
