import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionUpdateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates a specific FAQ section for an event.
 * This function allows for the modification of an existing FAQ section associated with a particular event.
 * It is designed to be used in scenarios where event organizers need to update the content or details of an FAQ section.
 * @name UpdateEventFaqSection
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the FAQ section
 * @param {EventFaqSectionUpdateInputs} section (body) - The inputs for updating the FAQ section
 * @version 1.3
 **/

export interface UpdateEventFaqSectionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  section: EventFaqSectionUpdateInputs;
}

export const UpdateEventFaqSection = async ({
  eventId,
  sectionId,
  section,
  adminApiParams,
  queryClient,
}: UpdateEventFaqSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<FaqSection>>(
    `/events/${eventId}/faqs/${sectionId}`,
    {
      ...section,
      id: undefined,
      faqs: undefined,
      organizationId: undefined,
      eventId: undefined,
      event: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_FAQ_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId || data.data.id],
      data
    );
  }
  return data;
};

export const useUpdateEventFaqSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFaqSection>>,
      Omit<UpdateEventFaqSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFaqSectionParams,
    Awaited<ReturnType<typeof UpdateEventFaqSection>>
  >(UpdateEventFaqSection, options, {
    domain: "events",
    type: "update",
  });
};