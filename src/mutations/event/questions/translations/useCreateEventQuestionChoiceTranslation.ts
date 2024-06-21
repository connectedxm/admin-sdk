import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslation";
import { EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionChoiceTranslations";
import { RegistrationQuestionChoiceTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventQuestionChoiceTranslationProps {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  autoTranslate,
}: CreateEventQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventQuestionChoiceTranslation = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<
      CreateEventQuestionChoiceTranslationProps,
      "eventId" | "questionId" | "choiceId"
    >
  >(
    (props) =>
      CreateEventQuestionChoiceTranslation({
        eventId,
        questionId,
        choiceId,
        ...props,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof CreateEventQuestionChoiceTranslation>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventQuestionChoiceTranslation;
