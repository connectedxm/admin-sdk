import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTIONS_QUERY_KEY,
  EVENT_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific section from an event.
 * This function allows the removal of a section within a specified event by providing the event and section IDs.
 * It is designed to be used in applications where event management and section organization are required.
 * @name DeleteEventSection
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @version 1.2
 **/
export interface DeleteEventSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
}

export const DeleteEventSection = async ({
  eventId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventSectionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sections/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SECTION_QUERY_KEY(eventId, sectionId),
    });
  }
  return data;
};

export const useDeleteEventSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSection>>,
      Omit<DeleteEventSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSectionParams,
    Awaited<ReturnType<typeof DeleteEventSection>>
  >(DeleteEventSection, options, {
    domain: "events",
    type: "update",
  });
};