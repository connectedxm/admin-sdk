import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslation";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventFAQSectionQuestionTranslationProps {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
}

export const DeleteEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
}: DeleteEventFAQSectionQuestionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventFAQSectionQuestionTranslation = (
  eventId: string,
  sectionId: string,
  questionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventFAQSectionQuestionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
          eventId,
          sectionId,
          questionId
        )
      );
      queryClient.invalidateQueries(
        EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(
          eventId,
          sectionId,
          questionId,
          locale
        )
      );
    },
  });
};

export default useDeleteEventFAQSectionQuestionTranslation;
