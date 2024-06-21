import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationQuestionSearchValue } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionSearchValues";
import { SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA } from "@context/queries/events/questions/useGetEventQuestionSearchValue";

interface UpdateEventQuestionSearchValueParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
  searchValue: RegistrationQuestionSearchValue;
}

export const UpdateEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
  searchValue,
}: UpdateEventQuestionSearchValueParams): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`,
    searchValue
  );
  return data;
};

export const useUpdateEventQuestionSearchValue = (
  eventId: string,
  questionId: string,
  searchValueId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationQuestionSearchValue>(
    (searchValue: RegistrationQuestionSearchValue) =>
      UpdateEventQuestionSearchValue({
        eventId,
        questionId,
        searchValueId: searchValueId || searchValue?.id?.toString(),
        searchValue,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventQuestionSearchValue>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId)
        );

        SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA(
          queryClient,
          [
            eventId,
            questionId,
            searchValueId || response?.data?.id?.toString(),
          ],
          response
        );
      },
    }
  );
};

export default useUpdateEventQuestionSearchValue;
