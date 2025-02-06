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
 * Endpoint to create search values for a specific event question.
 * This function allows the creation of search values associated with a particular question in an event.
 * It is designed to be used in applications where dynamic search values need to be added to event questions.
 * @name CreateEventQuestionSearchValues
 * @param {string} eventId (path) - The id of the event
 * @param {string} questionId (path) - The id of the question
 * @param {string[]} values (body) - The values to be created
 * @version 1.3
 **/
export interface CreateEventQuestionSearchValuesParams extends MutationParams {
  eventId: string;
  questionId: string;
  values: string[];
}

export const CreateEventQuestionSearchValues = async ({
  eventId,
  questionId,
  values,
  adminApiParams,
  queryClient,
}: CreateEventQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationQuestionChoice>
  >(`/events/${eventId}/questions/${questionId}/values`, values);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    });
  }
  return data;
};

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