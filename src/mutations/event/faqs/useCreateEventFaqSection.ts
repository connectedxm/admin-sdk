import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionCreateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new FAQ section for a specific event.
 * This function allows the creation of a FAQ section associated with a given event,
 * enabling users to add frequently asked questions and their answers to the event's details.
 * It is designed to be used in applications where event management and information dissemination are required.
 * @name CreateEventFaqSection
 * @param {string} eventId (path) The id of the event
 * @param {EventFaqSectionCreateInputs} faqSection (body) The inputs for creating the FAQ section
 * @version 1.2
 **/

export interface CreateEventFaqSectionParams extends MutationParams {
  eventId: string;
  faqSection: EventFaqSectionCreateInputs;
}

export const CreateEventFaqSection = async ({
  eventId,
  faqSection,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<FaqSection>>(
    `/events/${eventId}/faqs`,
    faqSection
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_FAQ_SECTION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

export const useCreateEventFaqSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFaqSection>>,
      Omit<CreateEventFaqSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFaqSectionParams,
    Awaited<ReturnType<typeof CreateEventFaqSection>>
  >(CreateEventFaqSection, options, {
    domain: "events",
    type: "update",
  });
};
