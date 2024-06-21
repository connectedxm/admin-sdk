import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslation";
import { EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslations";
import { RegistrationQuestionChoiceTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventQuestionChoiceTranslationProps {
  eventId: string;
  questionId: string;
  choiceId: string;
  choiceTranslation: RegistrationQuestionChoiceTranslation;
}

export const UpdateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  choiceTranslation,
}: UpdateEventQuestionChoiceTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = choiceTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    body
  );

  return data;
};

export const useUpdateEventQuestionChoiceTranslation = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<RegistrationQuestionChoiceTranslation>(
    (choiceTranslation: RegistrationQuestionChoiceTranslation) =>
      UpdateEventQuestionChoiceTranslation({
        eventId,
        questionId,
        choiceId,
        choiceTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventQuestionChoiceTranslation>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
            eventId,
            questionId,
            choiceId
          )
        );
        SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, questionId, choiceId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestionChoiceTranslation;
