import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslation";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslations";
import { FAQSectionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventFAQSectionTranslationProps {
  eventId: string;
  sectionId: string;
  faqSectionTranslation: FAQSectionTranslation;
}

export const UpdateEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  faqSectionTranslation,
}: UpdateEventFAQSectionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = faqSectionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/faqs/${sectionId}/translations/${faqSectionTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventFAQSectionTranslation = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<FAQSectionTranslation>(
    (faqSectionTranslation: FAQSectionTranslation) =>
      UpdateEventFAQSectionTranslation({
        eventId,
        sectionId,
        faqSectionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventFAQSectionTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId)
        );

        SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventFAQSectionTranslation;
