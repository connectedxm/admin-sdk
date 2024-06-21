import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslation";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslations";
import { SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslation";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionTranslations";
import { FAQSectionTranslation, FAQTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventFAQSectionQuestionTranslationProps {
  eventId: string;
  sectionId: string;
  questionId: string;
  faqSectionQuestionTranslation: FAQTranslation;
}

export const UpdateEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  faqSectionQuestionTranslation,
}: UpdateEventFAQSectionQuestionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = faqSectionQuestionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${faqSectionQuestionTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventFAQSectionQuestionTranslation = (
  eventId: string,
  sectionId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<FAQTranslation>(
    (faqSectionQuestionTranslation: FAQTranslation) =>
      UpdateEventFAQSectionQuestionTranslation({
        eventId,
        sectionId,
        questionId,
        faqSectionQuestionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventFAQSectionQuestionTranslation>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
            eventId,
            sectionId,
            questionId
          )
        );
        SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, questionId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventFAQSectionQuestionTranslation;
