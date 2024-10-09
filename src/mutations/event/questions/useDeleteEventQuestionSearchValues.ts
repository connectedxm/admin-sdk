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
export interface DeleteEventQuestionSearchValuesParams extends MutationParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const DeleteEventQuestionSearchValues = async ({
  eventId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/questions/${questionId}/values`
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
