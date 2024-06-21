import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationQuestionChoice } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_QUESTION_CHOICE_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestionChoice";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoices";

interface UpdateEventQuestionChoiceSubQuestionParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
  sortOrder: number;
}

export const UpdateEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
  sortOrder,
}: UpdateEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`,
    { sortOrder }
  );
  return data;
};

export const useUpdateEventQuestionChoiceSubQuestion = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    ({
      subQuestionId,
      sortOrder,
    }: {
      subQuestionId: string;
      sortOrder: number;
    }) =>
      UpdateEventQuestionChoiceSubQuestion({
        eventId,
        questionId,
        choiceId,
        subQuestionId,
        sortOrder,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateEventQuestionChoiceSubQuestion>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId)
        );
        SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
          queryClient,
          [eventId, questionId, choiceId],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestionChoiceSubQuestion;
