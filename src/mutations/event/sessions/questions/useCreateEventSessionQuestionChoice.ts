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
import {
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";
import { EventSessionQuestionChoiceCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionQuestionChoiceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choice: EventSessionQuestionChoiceCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionQuestionChoice = async ({
  eventId,
  sessionId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionChoiceParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionQuestionChoice>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices`,
    choice
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, data?.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSessionQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionQuestionChoice>>,
      Omit<
        CreateEventSessionQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionQuestionChoiceParams,
    Awaited<ReturnType<typeof CreateEventSessionQuestionChoice>>
  >(CreateEventSessionQuestionChoice, options, {
    domain: "events",
    type: "update",
  });
};
