import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionSearchValue,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionSearchValueUpdateInputs } from "@src/params";
import {
  EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY,
  SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the search value for a specific question in an event.
 * This function allows updating the search value associated with a particular question within an event.
 * It is useful for scenarios where the search criteria for event questions need to be modified.
 * @name UpdateEventQuestionSearchValue
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {string} searchValueId - The id of the search value
 * @param {EventQuestionSearchValueUpdateInputs} searchValue - The new search value inputs
 * @version 1.2
 **/
export interface UpdateEventQuestionSearchValueParams extends MutationParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
  searchValue: EventQuestionSearchValueUpdateInputs;
}

export const UpdateEventQuestionSearchValue = async ({
  eventId,
  questionId,
  searchValueId,
  searchValue,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionSearchValueParams): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationQuestionSearchValue>
  >(
    `/events/${eventId}/questions/${questionId}/values/${searchValueId}`,
    searchValue
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_SEARCH_VALUES_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_SEARCH_VALUE_QUERY_DATA(
      queryClient,
      [eventId, questionId, searchValueId],
      data
    );
  }
  return data;
};

export const useUpdateEventQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionSearchValue>>,
      Omit<
        UpdateEventQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionSearchValueParams,
    Awaited<ReturnType<typeof UpdateEventQuestionSearchValue>>
  >(UpdateEventQuestionSearchValue, options, {
    domain: "events",
    type: "update",
  });
};