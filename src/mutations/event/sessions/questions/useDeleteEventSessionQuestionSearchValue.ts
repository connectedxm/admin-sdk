import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionQuestionSearchValueParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionQuestionSearchValue = async ({
  eventId,
  sessionId,
  questionId,
  searchValueId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionSearchValueParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values/${searchValueId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionSearchValue>>,
      Omit<
        DeleteEventSessionQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionSearchValueParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionSearchValue>>
  >(DeleteEventSessionQuestionSearchValue, options, {
    domain: "events",
    type: "update",
  });
};
