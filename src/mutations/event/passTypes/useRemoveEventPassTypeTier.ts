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
 * Endpoint to remove a tier from a specified event pass type.
 * This function allows the removal of a specific tier from an event pass type, given the event ID, pass type ID, and tier ID.
 * It is used in scenarios where an event pass type needs to be modified by removing one of its tiers.
 * @name RemoveEventPassTypeTier
 * @param {boolean} allowed (query) Indicates if the operation is allowed
 * @param {string} eventId (path) The ID of the event
 * @param {string} passTypeId (path) The ID of the pass type
 * @param {string} tierId (path) The ID of the tier to be removed
 * @version 1.3
 **/

export interface RemoveEventPassTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  passTypeId: string;
  tierId: string;
}

export const RemoveEventPassTypeTier = async ({
  allowed,
  eventId,
  passTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventPassTypeTierParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}/tiers/${tierId}`,
    {
      params: {
        allowed,
      },
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

export const useRemoveEventPassTypeTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassTypeTier>>,
      Omit<RemoveEventPassTypeTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassTypeTierParams,
    Awaited<ReturnType<typeof RemoveEventPassTypeTier>>
  >(RemoveEventPassTypeTier, options, {
    domain: "events",
    type: "update",
  });
};
