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
 * @category Params
 * @group Event-Questions
 */
export interface UpdateEventQuestionSearchValueParams extends MutationParams {
  eventId: string;
  questionId: string;
  searchValueId: string;
  searchValue: EventQuestionSearchValueUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Questions
 */
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

/**
 * @category Mutations
 * @group Event-Questions
 */
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
