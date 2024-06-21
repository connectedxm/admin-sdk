import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationQuestionChoice } from "@interfaces";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionSearchValues";

interface CreateEventQuestionSearchValuesParams {
  eventId: string;
  questionId: string;
  values: string[];
}

export const CreateEventQuestionSearchValues = async ({
  eventId,
  questionId,
  values,
}: CreateEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/questions/${questionId}/values`,
    values
  );
  return data;
};

export const useCreateEventQuestionSearchValues = (
  eventId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (values: string[]) =>
      CreateEventQuestionSearchValues({ eventId, questionId, values }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof CreateEventQuestionSearchValues>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId)
        );
      },
    }
  );
};

export default useCreateEventQuestionSearchValues;
