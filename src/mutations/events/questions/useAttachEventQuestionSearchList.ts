import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { RegistrationQuestion, ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUESTION_QUERY_KEY, SEARCHLIST_QUERY_KEY } from "@src/queries";
import { AttachSearchListInputs } from "@src/params";

/**
 * @category Params
 * @group Event-Question
 */
export interface AttachEventQuestionSearchListParams extends MutationParams {
  eventId: string;
  questionId: string;
  searchList: AttachSearchListInputs;
}

/**
 * @category Methods
 * @group Event-Question
 */
export const AttachEventQuestionSearchList = async ({
  eventId,
  questionId,
  searchList,
  adminApiParams,
  queryClient,
}: AttachEventQuestionSearchListParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/events/${eventId}/questions/${questionId}/searchlist`, searchList);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_QUERY_KEY(eventId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_QUERY_KEY(searchList.searchListId),
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
export const useAttachEventQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AttachEventQuestionSearchList>>,
      Omit<
        AttachEventQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AttachEventQuestionSearchListParams,
    Awaited<ReturnType<typeof AttachEventQuestionSearchList>>
  >(AttachEventQuestionSearchList, options);
};
