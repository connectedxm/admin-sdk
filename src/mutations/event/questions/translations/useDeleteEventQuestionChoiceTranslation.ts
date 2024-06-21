import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslation";
import { EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventQuestionChoiceTranslationProps {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

export const DeleteEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
}: DeleteEventQuestionChoiceTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventQuestionChoiceTranslation = (
  eventId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventQuestionChoiceTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
          eventId,
          questionId,
          choiceId
        )
      );
      queryClient.invalidateQueries(
        EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
          eventId,
          questionId,
          choiceId,
          locale
        )
      );
    },
  });
};

export default useDeleteEventQuestionChoiceTranslation;
