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
export interface DeleteEventSessionQuestionSearchValuesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionQuestionSearchValues = async ({
  eventId,
  sessionId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values`
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
export const useDeleteEventSessionQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionSearchValues>>,
      Omit<
        DeleteEventSessionQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionSearchValuesParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionSearchValues>>
  >(DeleteEventSessionQuestionSearchValues, options, {
    domain: "events",
    type: "update",
  });
};
