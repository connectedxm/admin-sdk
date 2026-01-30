import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes
 */
export interface RemoveEventPassTypeGroupPassTierParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const RemoveEventPassTypeGroupPassTier = async ({
  eventId,
  passTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventPassTypeGroupPassTierParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}/groupPassTiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(queryClient, [eventId, passTypeId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes
 */
export const useRemoveEventPassTypeGroupPassTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassTypeGroupPassTier>>,
      Omit<
        RemoveEventPassTypeGroupPassTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassTypeGroupPassTierParams,
    Awaited<ReturnType<typeof RemoveEventPassTypeGroupPassTier>>
  >(RemoveEventPassTypeGroupPassTier, options);
};
