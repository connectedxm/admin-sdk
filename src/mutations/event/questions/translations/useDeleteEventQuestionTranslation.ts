import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_QUESTION_TRANSLATION_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionTranslation";
import { EVENT_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventQuestionTranslationProps {
  eventId: string;
  questionId: string;
  locale: string;
}

export const DeleteEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
}: DeleteEventQuestionTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventQuestionTranslation = (
  eventId: string,
  questionId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventQuestionTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId)
      );
      queryClient.invalidateQueries(
        EVENT_QUESTION_TRANSLATION_QUERY_KEY(eventId, questionId, locale)
      );
    },
  });
};

export default useDeleteEventQuestionTranslation;
