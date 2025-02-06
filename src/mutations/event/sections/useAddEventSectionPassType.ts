import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_PASS_TYPES_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a pass type to a specific event section.
 * This function allows the addition of a pass type to a designated section within an event.
 * It is used to manage and update the pass types associated with event sections.
 * @name AddEventSectionPassType
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the section
 * @param {string} passTypeId (path) - The id of the pass type
 * @version 1.3
 **/
export interface AddEventSectionPassTypeParams extends MutationParams {
  eventId: string;
  sectionId: string;
  passTypeId: string;
}

export const AddEventSectionPassType = async ({
  eventId,
  sectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventSectionPassTypeParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/passTypes/${passTypeId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_PASS_TYPES_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useAddEventSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionPassType>>,
      Omit<AddEventSectionPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionPassTypeParams,
    Awaited<ReturnType<typeof AddEventSectionPassType>>
  >(AddEventSectionPassType, options, {
    domain: "events",
    type: "update",
  });
};