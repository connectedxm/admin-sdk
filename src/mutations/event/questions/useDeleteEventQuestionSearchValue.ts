import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface DeleteEventQuestionSearchValueParams extends MutationParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Methods
 * @group Event-Questions
 */
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

/**
 * @category Mutations
 * @group Event-Questions
 */
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
