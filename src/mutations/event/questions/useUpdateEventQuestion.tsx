import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationQuestion } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTIONS_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestions";
import { SET_EVENT_QUESTION_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestion";

interface UpdateEventQuestionParams {
  eventId: string;
  questionId: string;
  question: RegistrationQuestion;
}

export const UpdateEventQuestion = async ({
  eventId,
  questionId,
  question,
}: UpdateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}`,
    {
      ...question,
      id: undefined,
      eventId: undefined,
      choices: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  return data;
};

export const useUpdateEventQuestion = (
  eventId: string,
  questionId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestion>(
    (question: RegistrationQuestion) =>
      UpdateEventQuestion({
        eventId,
        questionId: questionId || question?.id.toString(),
        question,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventQuestion>>
      ) => {
        queryClient.invalidateQueries(EVENT_QUESTIONS_QUERY_KEY(eventId));
        SET_EVENT_QUESTION_QUERY_DATA(
          queryClient,
          [eventId, questionId || response.data.id.toString()],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestion;
