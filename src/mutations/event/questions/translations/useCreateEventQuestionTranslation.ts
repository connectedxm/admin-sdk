import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA } from "@context/queries/events/questions/translations/useGetEventQuestionTranslation";
import { EVENT_QUESTION_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/questions/translations/useGetEventQuestionTranslations";
import { RegistrationQuestionTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventQuestionTranslationProps {
  eventId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  autoTranslate,
}: CreateEventQuestionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/events/${eventId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateEventQuestionTranslation = (
  eventId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateEventQuestionTranslationProps, "eventId" | "questionId">
  >(
    (props) =>
      CreateEventQuestionTranslation({ eventId, questionId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventQuestionTranslation>>
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
    },
    "Hold on while we create a translation..."
  );
};

export default useCreateEventQuestionTranslation;
