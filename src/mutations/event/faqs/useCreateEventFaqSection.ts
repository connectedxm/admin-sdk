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
 * @category Params
 * @group Event-Faqs
 */
export interface CreateEventFaqSectionParams extends MutationParams {
  eventId: string;
  faqSection: EventFaqSectionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const CreateEventFaqSection = async ({
  eventId,
  faqSection,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionParams): Promise<ConnectedXMResponse<FaqSection>> => {
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
  >(CreateEventFaqSection, options);
};
