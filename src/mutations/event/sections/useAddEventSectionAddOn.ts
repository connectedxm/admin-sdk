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
 * @category Params
 * @group Event-Sections
 */
export interface AddEventSectionAddOnParams extends MutationParams {
  eventId: string;
  sectionId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const AddEventSectionAddOn = async ({
  eventId,
  sectionId,
  addOnId,
  adminApiParams,
  queryClient,
}: AddEventSectionAddOnParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
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

/**
 * @category Mutations
 * @group Event-Sections
 */
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
