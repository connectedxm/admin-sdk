import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionCreateParams } from "@src/params";
import {
  EVENT_FAQ_SECTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs
 */
export interface CreateEventFAQSectionParams extends MutationParams {
  eventId: string;
  faqSection: EventFaqSectionCreateParams;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const CreateEventFAQSection = async ({
  eventId,
  faqSection,
  adminApiParams,
  queryClient,
}: CreateEventFAQSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<FaqSection>>(
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

/**
 * @category Mutations
 * @group Event-Faqs
 */
export const useCreateEventFAQSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFAQSection>>,
      Omit<CreateEventFAQSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFAQSectionParams,
    Awaited<ReturnType<typeof CreateEventFAQSection>>
  >(CreateEventFAQSection, options);
};
