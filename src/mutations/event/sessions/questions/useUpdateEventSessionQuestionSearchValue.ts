import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionSearchValue,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionSearchValueUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionQuestionSearchValueParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  searchValueId: string;
  searchValue: EventSessionQuestionSearchValueUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionQuestionSearchValue = async ({
  eventId,
  sessionId,
  questionId,
  searchValueId,
  searchValue,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionSearchValueParams): Promise<
  ConnectedXMResponse<EventSessionQuestionSearchValue>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestionSearchValue>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values/${searchValueId}`,
    searchValue
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_SEARCH_VALUES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    SET_EVENT_SESSION_QUESTION_SEARCH_VALUE_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, searchValueId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestionSearchValue>>,
      Omit<
        UpdateEventSessionQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionSearchValueParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestionSearchValue>>
  >(UpdateEventSessionQuestionSearchValue, options, {
    domain: "events",
    type: "update",
  });
};
