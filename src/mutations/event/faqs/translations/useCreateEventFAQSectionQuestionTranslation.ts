import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslation";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/faqs/translations/useGetEventFAQSectionQuestionTranslations";
import { FAQTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventFAQSectionQuestionTranslationProps {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  autoTranslate,
}: CreateEventFAQSectionQuestionTranslationProps): Promise<
  ConnectedXMResponse<FAQTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventFAQSectionQuestionTranslation = (
  eventId: string,
  sectionId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<
      CreateEventFAQSectionQuestionTranslationProps,
      "eventId" | "sectionId" | "questionId"
    >
  >(
    (props) =>
      CreateEventFAQSectionQuestionTranslation({
        eventId,
        sectionId,
        questionId,
        ...props,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof CreateEventFAQSectionQuestionTranslation>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventFAQSectionQuestionTranslation;
