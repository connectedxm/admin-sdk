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
 * Endpoint to create a new event question choice.
 * This function allows the creation of a choice for a specific question within an event.
 * It is designed to be used in applications where event management and customization are required.
 * @name CreateEventQuestionChoice
 * @param {string} eventId (path) - The id of the event
 * @param {string} questionId (path) - The id of the question
 * @param {EventQuestionChoiceCreateInputs} choice (body) - The choice inputs for the event question
 * @version 1.3
**/
export interface CreateEventQuestionChoiceParams extends MutationParams {
  eventId: string;
  questionId: string;
  choice: EventQuestionChoiceCreateInputs;
}

export const CreateEventQuestionChoice = async ({
  eventId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateEventQuestionChoiceParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
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
}

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
  >(CreateEventQuestionChoice, options, {
    domain: "events",
    type: "update",
  });
};