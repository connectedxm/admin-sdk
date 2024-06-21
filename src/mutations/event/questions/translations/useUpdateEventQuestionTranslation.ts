import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/questions/translations/useGetEventQuestionTranslation";
import { EVENT_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionTranslations";
import { RegistrationQuestionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventQuestionTranslationProps {
  eventId: string;
  questionId: string;
  questionTranslation: RegistrationQuestionTranslation;
}

export const UpdateEventQuestionTranslation = async ({
  eventId,
  questionId,
  questionTranslation,
}: UpdateEventQuestionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = questionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`,
    body
  );

  return data;
};

export const useUpdateEventQuestionTranslation = (
  eventId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<RegistrationQuestionTranslation>(
    (questionTranslation: RegistrationQuestionTranslation) =>
      UpdateEventQuestionTranslation({
        eventId,
        questionId,
        questionTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventQuestionTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId)
        );
        SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, questionId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestionTranslation;
