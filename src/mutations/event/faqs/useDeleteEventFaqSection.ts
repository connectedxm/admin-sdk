import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific FAQ section for an event and invalidate related queries.
 * This function allows the removal of a FAQ section associated with a particular event, ensuring that any cached queries related to the FAQ sections are invalidated.
 * It is useful in scenarios where FAQ sections need to be dynamically managed and kept up-to-date.
 * @name DeleteEventFaqSection
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the FAQ section
 * @version 1.2
 **/
export interface DeleteEventFaqSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
}

export const DeleteEventFaqSection = async ({
  eventId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/faqs/${sectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    });
  }
  return data;
};

export const useDeleteEventFaqSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSection>>,
      Omit<DeleteEventFaqSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionParams,
    Awaited<ReturnType<typeof DeleteEventFaqSection>>
  >(DeleteEventFaqSection, options, {
    domain: "events",
    type: "update",
  });
};