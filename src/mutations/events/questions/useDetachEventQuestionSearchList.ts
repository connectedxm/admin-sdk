import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { RegistrationQuestion, ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUESTION_QUERY_KEY, SEARCHLISTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Question
 */
export interface DetachEventQuestionSearchListParams extends MutationParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Question
 */
export const DetachEventQuestionSearchList = async ({
  eventId,
  questionId,
  adminApiParams,
  queryClient,
}: DetachEventQuestionSearchListParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/events/${eventId}/questions/${questionId}/searchlist`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_QUERY_KEY(eventId, questionId),
    });
    // Since we don't know which searchlist was detached, invalidate all searchlists
    queryClient.invalidateQueries({
      queryKey: SEARCHLISTS_QUERY_KEY(),
    });
    // Also invalidate all searchlist values queries to ensure fresh data
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === "SEARCHLIST_VALUES";
      },
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question
 */
export const useDetachEventQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DetachEventQuestionSearchList>>,
      Omit<
        DetachEventQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DetachEventQuestionSearchListParams,
    Awaited<ReturnType<typeof DetachEventQuestionSearchList>>
  >(DetachEventQuestionSearchList, options);
};
