import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { FAQSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSections";
import { SET_EVENT_FAQ_SECTION_QUERY_DATA } from "@context/queries/events/faqs/useGetEventFAQSection";

interface CreateEventFAQSectionParams {
  eventId: string;
  faqSection: FAQSection;
}

export const CreateEventFAQSection = async ({
  eventId,
  faqSection,
}: CreateEventFAQSectionParams): Promise<ConnectedXMResponse<FAQSection>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/faqs`,
    faqSection
  );
  return data;
};

export const useCreateEventFAQSection = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<FAQSection>(
    (faqSection: FAQSection) => CreateEventFAQSection({ eventId, faqSection }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventFAQSection>>
      ) => {
        queryClient.invalidateQueries(EVENT_FAQ_SECTIONS_QUERY_KEY(eventId));
        SET_EVENT_FAQ_SECTION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventFAQSection;
