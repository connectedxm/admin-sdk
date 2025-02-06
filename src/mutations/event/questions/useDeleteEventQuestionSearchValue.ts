import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific search value for a question in an event.
 * This function allows the removal of a search value associated with a particular question within an event.
 * It is useful in scenarios where search values need to be managed or cleaned up.
 * @name DeleteEventQuestionSearchValue
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {string} searchValueId (path) The id of the search value
 * @version 1.3
 **/
export interface DeleteEventQuestionSearchValueParams extends MutationParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
}

export const DeleteEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionSearchValueParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    });
  }
  return data;
};

export const useDeleteEventQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionSearchValue>>,
      Omit<
        DeleteEventQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionSearchValueParams,
    Awaited<ReturnType<typeof DeleteEventQuestionSearchValue>>
  >(DeleteEventQuestionSearchValue, options, {
    domain: "events",
    type: "update",
  });
};
