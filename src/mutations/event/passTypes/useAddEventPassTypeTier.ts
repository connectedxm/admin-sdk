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
 * Endpoint to add a new tier to an event pass type.
 * This function allows the addition of a specific tier to an event pass type, specifying whether the tier is allowed.
 * It is used in scenarios where event organizers need to manage tiers within their event pass types.
 * @name AddEventPassTypeTier
 * @param {boolean} allowed (bodyValue) Indicates if the tier is allowed
 * @param {string} eventId (path) The id of the event
 * @param {string} passTypeId (path) The id of the pass type
 * @param {string} tierId (path) The id of the tier
 * @version 1.3
 **/
export interface AddEventPassTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  passTypeId: string;
  tierId: string;
}

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
