import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TIERS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove a tier from a specific event section.
 * This function allows the removal of a tier from an event section by specifying the event, section, and tier IDs.
 * It is used in scenarios where managing event sections and their tiers is necessary.
 * @name RemoveEventSectionTier
 * @param {boolean} allowed (query) Indicates if the operation is allowed
 * @param {string} eventId (path) The id of the event
 * @param {string} sectionId (path) The id of the section
 * @param {string} tierId (path) The id of the tier
 * @version 1.3
 **/

export interface RemoveEventSectionTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  sectionId: string;
  tierId: string;
}

export const RemoveEventSectionTier = async ({
  allowed,
  eventId,
  sectionId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/tiers/${tierId}`, {
    params: {
      allowed,
    },
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TIERS_QUERY_KEY(allowed, eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useRemoveEventSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionTier>>,
      Omit<RemoveEventSectionTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionTierParams,
    Awaited<ReturnType<typeof RemoveEventSectionTier>>
  >(RemoveEventSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
