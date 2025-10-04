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
import {
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";
import { EventQuestionChoiceCreateInputs } from "../../../params";

/**
 * @category Params
 * @group Event-Questions
 */
export interface CreateEventQuestionChoiceParams extends MutationParams {
  eventId: string;
  questionId: string;
  choice: EventQuestionChoiceCreateInputs;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const CreateEventQuestionChoice = async ({
  eventId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateEventQuestionChoiceParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationQuestionChoice>
  >(`/events/${eventId}/questions/${questionId}/choices`, choice);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, questionId, data?.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Questions
 */
export const useCreateEventQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestionChoice>>,
      Omit<CreateEventQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionChoiceParams,
    Awaited<ReturnType<typeof CreateEventQuestionChoice>>
  >(CreateEventQuestionChoice, options);
};
