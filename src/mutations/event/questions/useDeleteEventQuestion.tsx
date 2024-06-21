import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_QUESTIONS_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestions";
import { EVENT_QUESTION_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestion";

interface DeleteEventQuestionParams {
  eventId: string;
  questionId: string;
}

export const DeleteEventQuestion = async ({
  eventId,
  questionId,
}: DeleteEventQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}`
  );
  return data;
};

export const useDeleteEventQuestion = (eventId: string, questionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventQuestion({ eventId, questionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventQuestion>>
      ) => {
        await router.push(`/events/${eventId}/sections/questions`);
        queryClient.invalidateQueries(EVENT_QUESTIONS_QUERY_KEY(eventId));
        queryClient.removeQueries(
          EVENT_QUESTION_QUERY_KEY(eventId, questionId)
        );
      },
    }
  );
};

export default useDeleteEventQuestion;
