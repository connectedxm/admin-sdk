import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_TIERS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-PassTypes
 */
export interface AddEventPassTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  passTypeId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const AddEventPassTypeTier = async ({
  allowed,
  eventId,
  passTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventPassTypeTierParams): Promise<ConnectedXMResponse<EventPassType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}/tiers/${tierId}`,
    {
      allowed,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_TIERS_QUERY_KEY(allowed, eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(queryClient, [eventId, passTypeId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-PassTypes
 */
export const useAddEventPassTypeTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPassTypeTier>>,
      Omit<AddEventPassTypeTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPassTypeTierParams,
    Awaited<ReturnType<typeof AddEventPassTypeTier>>
  >(AddEventPassTypeTier, options, {
    domain: "events",
    type: "update",
  });
};
