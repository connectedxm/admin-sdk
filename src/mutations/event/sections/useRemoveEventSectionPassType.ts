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
 * Endpoint to remove a pass type from a specific section of an event.
 * This function allows the removal of a designated pass type from a specified section within an event.
 * It is intended for use in scenarios where event management requires dynamic updates to pass type allocations.
 * @name RemoveEventSectionPassType
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the section
 * @param {string} passTypeId (path) - The id of the pass type
 * @version 1.3
**/
export interface RemoveEventSectionPassTypeParams extends MutationParams {
  eventId: string;
  sectionId: string;
  passTypeId: string;
}

export const RemoveEventSectionPassType = async ({
  eventId,
  sectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionPassTypeParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
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

export const useRemoveEventSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionPassType>>,
      Omit<RemoveEventSectionPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventSectionPassType>>
  >(RemoveEventSectionPassType, options, {
    domain: "events",
    type: "update",
  });
};