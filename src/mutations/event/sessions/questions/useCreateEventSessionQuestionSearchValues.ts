import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionChoice,
} from "@src/interfaces";
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
export interface CreateEventSessionQuestionSearchValuesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  values: string[];
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionQuestionSearchValues = async ({
  eventId,
  sessionId,
  questionId,
  values,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionQuestionChoice>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values`,
    values
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
export const useCreateEventSessionQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionQuestionSearchValues>>,
      Omit<
        CreateEventSessionQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionQuestionSearchValuesParams,
    Awaited<ReturnType<typeof CreateEventSessionQuestionSearchValues>>
  >(CreateEventSessionQuestionSearchValues, options, {
    domain: "events",
    type: "update",
  });
};
