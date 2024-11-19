import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionCreateInputs } from "@src/params";
import { SET_EVENT_SESSION_QUESTION_QUERY_DATA } from "@src/queries/events/sessions/questions/useGetEventSessionQuestion";
import { EVENT_SESSION_QUESTIONS_QUERY_KEY } from "@src/queries/events/sessions/questions/useGetEventSessionQuestions";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface CreateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  question: EventSessionQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const CreateEventSessionQuestion = async ({
  eventId,
  sessionId,
  question,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionQuestion>
  >(`/events/${eventId}/sessions/${sessionId}/questions`, question);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useCreateEventSessionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionQuestion>>,
      Omit<CreateEventSessionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionQuestionParams,
    Awaited<ReturnType<typeof CreateEventSessionQuestion>>
  >(CreateEventSessionQuestion, options, {
    domain: "events",
    type: "update",
  });
};
