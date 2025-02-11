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
 * Endpoint to add a tier to a specific event section.
 * This function allows the addition of a tier to an event section by specifying the event, section, and tier IDs.
 * It is used in scenarios where event sections need to be dynamically updated with new tiers.
 * @name AddEventSectionTier
 * @param {boolean} allowed (bodyValue) Indicates if the tier is allowed
 * @param {string} eventId (path) The id of the event
 * @param {string} sectionId (path) The id of the section
 * @param {string} tierId (path) The id of the tier
 * @version 1.3
 **/
export interface AddEventSectionTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  sectionId: string;
  tierId: string;
}

export const AddEventSectionTier = async ({
  allowed,
  eventId,
  sectionId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/sections/${sectionId}/tiers/${tierId}`,
    {
      allowed,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TIERS_QUERY_KEY(allowed, eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useAddEventSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionTier>>,
      Omit<AddEventSectionTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionTierParams,
    Awaited<ReturnType<typeof AddEventSectionTier>>
  >(AddEventSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
