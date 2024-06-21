import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationQuestionChoice, RegistrationSection } from "@interfaces";
import { EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionChoiceSubQuestions";
import { SET_EVENT_QUESTION_CHOICE_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestionChoice";

interface AddEventQuestionChoiceSubQuestionParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

export const AddEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
}: AddEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );
  return data;
};

export const useAddEventQuestionChoiceSubQuestion = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (subQuestionId: string) =>
      AddEventQuestionChoiceSubQuestion({
        eventId,
        questionId,
        choiceId,
        subQuestionId,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventQuestionChoiceSubQuestion>>
      ) => {
        SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
          queryClient,
          [eventId, questionId, choiceId],
          response
        );
        queryClient.invalidateQueries(
          EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(
            eventId,
            questionId,
            choiceId
          )
        );
      },
    }
  );
};

export default useAddEventQuestionChoiceSubQuestion;
