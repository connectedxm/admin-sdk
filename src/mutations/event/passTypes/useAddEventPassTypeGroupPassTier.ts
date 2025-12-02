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
export interface AddEventPassTypeGroupPassTierParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const AddEventPassTypeGroupPassTier = async ({
  eventId,
  passTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventPassTypeGroupPassTierParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPassType>>(
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
export const useAddEventPassTypeGroupPassTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPassTypeGroupPassTier>>,
      Omit<
        AddEventPassTypeGroupPassTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPassTypeGroupPassTierParams,
    Awaited<ReturnType<typeof AddEventPassTypeGroupPassTier>>
  >(AddEventPassTypeGroupPassTier, options);
};
