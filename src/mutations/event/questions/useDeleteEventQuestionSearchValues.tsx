import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionSearchValues";

interface DeleteEventQuestionSearchValuesParams {
  eventId: string;
  questionId: string;
}

export const DeleteEventQuestionSearchValues = async ({
  eventId,
  questionId,
}: DeleteEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/values`
  );
  return data;
};

export const useDeleteEventQuestionSearchValues = (
  eventId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => DeleteEventQuestionSearchValues({ eventId, questionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventQuestionSearchValues>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId)
        );
      },
    },
    undefined
  );
};

export default useDeleteEventQuestionSearchValues;
