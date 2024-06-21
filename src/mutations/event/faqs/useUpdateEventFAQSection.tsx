import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { FAQ, FAQSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSections";
import { SET_EVENT_FAQ_SECTION_QUERY_DATA } from "@context/queries/events/faqs/useGetEventFAQSection";

interface UpdateEventFAQSectionParams {
  eventId: string;
  sectionId: string;
  section: FAQSection;
}

export const UpdateEventFAQSection = async ({
  eventId,
  sectionId,
  section,
}: UpdateEventFAQSectionParams): Promise<ConnectedXMResponse<FAQSection>> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
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
  return data;
};

export const useUpdateEventFAQSection = (
  eventId: string,
  sectionId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<FAQSection>(
    (section: FAQSection) =>
      UpdateEventFAQSection({
        eventId,
        sectionId: sectionId || section?.id,
        section,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventFAQSection>>
      ) => {
        queryClient.invalidateQueries(EVENT_FAQ_SECTIONS_QUERY_KEY(eventId));
        SET_EVENT_FAQ_SECTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId || response.data.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventFAQSection;
