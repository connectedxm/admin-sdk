import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationQuestion, RegistrationQuestionChoice } from "@interfaces";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoices";
import { SET_EVENT_QUESTION_CHOICE_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestionChoice";

interface CreateEventQuestionChoiceParams {
  eventId: string;
  questionId: string;
  choice: RegistrationQuestionChoice;
}

export const CreateEventQuestionChoice = async ({
  eventId,
  questionId,
  choice,
}: CreateEventQuestionChoiceParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/questions/${questionId}/choices`,
    choice
  );
  return data;
};

export const useCreateEventQuestionChoice = (
  eventId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestionChoice>(
    (choice: RegistrationQuestionChoice) =>
      CreateEventQuestionChoice({ eventId, questionId, choice }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventQuestionChoice>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId)
        );
        SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
          queryClient,
          [eventId, questionId, response.data.id.toString()],
          response
        );
      },
    }
  );
};

export default useCreateEventQuestionChoice;
