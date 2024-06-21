import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoices";

interface RemoveEventQuestionChoiceSubQuestionParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

export const RemoveEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
}: RemoveEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  return data;
};

export const useRemoveEventQuestionChoiceSubQuestion = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (subQuestionId: string) =>
      RemoveEventQuestionChoiceSubQuestion({
        eventId,
        questionId,
        choiceId,
        subQuestionId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId)
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventQuestionChoiceSubQuestion;
