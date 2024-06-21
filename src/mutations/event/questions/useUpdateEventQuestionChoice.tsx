import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationQuestionChoice } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoices";
import { SET_EVENT_QUESTION_CHOICE_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestionChoice";

interface UpdateEventQuestionChoiceParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  choice: RegistrationQuestionChoice;
}

export const UpdateEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
  choice,
}: UpdateEventQuestionChoiceParams) => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`,
    {
      ...choice,
      id: undefined,
      questionId: undefined,
      question: undefined,
      subQuestions: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventQuestionChoice = (
  eventId: string,
  questionId: string,
  choiceId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestionChoice>(
    (choice: RegistrationQuestionChoice) =>
      UpdateEventQuestionChoice({
        eventId,
        questionId,
        choiceId: choiceId || choice.id.toString(),
        choice,
      }),
    {
      onSuccess: (
        response: ConnectedXMResponse<RegistrationQuestionChoice>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId)
        );
        SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
          queryClient,
          [eventId, questionId, choiceId || response.data.id.toString()],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestionChoice;
