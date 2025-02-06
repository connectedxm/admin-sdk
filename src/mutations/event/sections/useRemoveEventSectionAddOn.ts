import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_ADDONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove an add-on from a specific event section.
 * This function allows the removal of a specified add-on from a given section within an event.
 * It is useful for managing event configurations by dynamically updating the available add-ons for event sections.
 * @name RemoveEventSectionAddOn
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the section
 * @param {string} addOnId (path) - The id of the add-on
 * @version 1.3
 **/
export interface RemoveEventSectionAddOnParams extends MutationParams {
  eventId: string;
  sectionId: string;
  addOnId: string;
}

export const RemoveEventSectionAddOn = async ({
  eventId,
  sectionId,
  addOnId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionAddOnParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/addOns/${addOnId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_ADDONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useRemoveEventSectionAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionAddOn>>,
      Omit<RemoveEventSectionAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionAddOnParams,
    Awaited<ReturnType<typeof RemoveEventSectionAddOn>>
  >(RemoveEventSectionAddOn, options, {
    domain: "events",
    type: "update",
  });
};