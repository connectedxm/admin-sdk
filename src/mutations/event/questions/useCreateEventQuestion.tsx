import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationQuestion } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTIONS_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestions";
import { SET_EVENT_QUESTION_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestion";

interface CreateEventQuestionParams {
  eventId: string;
  question: RegistrationQuestion;
}

export const CreateEventQuestion = async ({
  eventId,
  question,
}: CreateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/questions`,
    question
  );
  return data;
};

export const useCreateEventQuestion = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestion>(
    (question: RegistrationQuestion) =>
      CreateEventQuestion({ eventId, question }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventQuestion>>
      ) => {
        queryClient.invalidateQueries(EVENT_QUESTIONS_QUERY_KEY(eventId));
        SET_EVENT_QUESTION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id.toString()],
          response
        );
      },
    }
  );
};

export default useCreateEventQuestion;
