import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoices";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoice";

interface DeleteEventQuestionChoiceParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const DeleteEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
}: DeleteEventQuestionChoiceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};

export const useDeleteEventQuestionChoice = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => DeleteEventQuestionChoice({ eventId, questionId, choiceId }),
    {
      onSuccess: async (
        response: Awaited<ReturnType<typeof DeleteEventQuestionChoice>>
      ) => {
        await router.push(
          `/events/${eventId}/sections/questions/${questionId}/choices`
        );
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId)
        );
        queryClient.removeQueries(
          EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId)
        );
      },
    },
    undefined
  );
};

export default useDeleteEventQuestionChoice;
