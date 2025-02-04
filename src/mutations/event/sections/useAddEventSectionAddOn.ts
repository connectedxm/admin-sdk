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
 * Adds an add-on to a specific section of an event.
 * This function is used to associate an additional feature or service (add-on) with a particular section of an event.
 * It is useful in scenarios where events are modular and require dynamic configuration of sections with various add-ons.
 * @name AddEventSectionAddOn
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @param {string} addOnId - The id of the add-on
 * @version 1.2
 **/
export interface AddEventSectionAddOnParams extends MutationParams {
  eventId: string;
  sectionId: string;
  addOnId: string;
}

export const AddEventSectionAddOn = async ({
  eventId,
  sectionId,
  addOnId,
  adminApiParams,
  queryClient,
}: AddEventSectionAddOnParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/sections/${sectionId}/addOns/${addOnId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_ADDONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useAddEventSectionAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionAddOn>>,
      Omit<AddEventSectionAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionAddOnParams,
    Awaited<ReturnType<typeof AddEventSectionAddOn>>
  >(AddEventSectionAddOn, options, {
    domain: "events",
    type: "update",
  });
};