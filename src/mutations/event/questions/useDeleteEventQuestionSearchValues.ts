import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete search values for a specific question in an event.
 * This function allows the removal of search values associated with a particular question within a specified event.
 * It is useful in scenarios where search values need to be cleared or reset for event questions.
 * @name DeleteEventQuestionSearchValues
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @version 1.2
**/
export interface DeleteEventQuestionSearchValuesParams extends MutationParams {
  eventId: string;
  questionId: string;
}

export const DeleteEventQuestionSearchValues = async ({
  eventId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/questions/${questionId}/values`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    });
  }
  return data;
};

export const useDeleteEventQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionSearchValues>>,
      Omit<
        DeleteEventQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionSearchValuesParams,
    Awaited<ReturnType<typeof DeleteEventQuestionSearchValues>>
  >(DeleteEventQuestionSearchValues, options, {
    domain: "events",
    type: "update",
  });
};