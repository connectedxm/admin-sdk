import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionChoice,
} from "@src/interfaces";
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
export interface CreateEventQuestionSearchValuesParams extends MutationParams {
  eventId: string;
  questionId: string;
  values: string[];
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const CreateEventQuestionSearchValues = async ({
  eventId,
  questionId,
  values,
  adminApiParams,
  queryClient,
}: CreateEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationQuestionChoice>
  >(`/events/${eventId}/questions/${questionId}/values`, values);

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
export const useCreateEventQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestionSearchValues>>,
      Omit<
        CreateEventQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionSearchValuesParams,
    Awaited<ReturnType<typeof CreateEventQuestionSearchValues>>
  >(CreateEventQuestionSearchValues, options, {
    domain: "events",
    type: "update",
  });
};
