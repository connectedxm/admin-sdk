import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@context/queries/events/questions/useGetEventQuestionSearchValues";
import { useRouter } from "next/router";

interface DeleteEventQuestionSearchValueParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
}

export const DeleteEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
}: DeleteEventQuestionSearchValueParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`
  );
  return data;
};

export const useDeleteEventQuestionSearchValue = (
  eventId: string,
  questionId: string,
  searchValueId?: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation<any>(
    (valueId: string) =>
      DeleteEventQuestionSearchValue({
        eventId,
        questionId,
        searchValueId: searchValueId || valueId,
      }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventQuestionSearchValue>>
      ) => {
        await router.push(
          `/events/${eventId}/sections/questions/${questionId}/values`
        );
        queryClient.invalidateQueries(
          EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId)
        );
      },
    },
    undefined,
    true
  );
};

export default useDeleteEventQuestionSearchValue;
