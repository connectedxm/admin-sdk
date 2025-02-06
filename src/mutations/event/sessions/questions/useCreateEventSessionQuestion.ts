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
 * Endpoint to create a new question for a specific event session.
 * This function allows the creation of a question within a specified event session, 
 * enabling users to add interactive elements to their event sessions.
 * It is designed to be used in applications where event session management is required.
 * @name CreateEventSessionQuestion
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {EventSessionQuestionCreateInputs} question (body) - The question details
 * @version 1.3
 **/

export interface CreateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  question: EventSessionQuestionCreateInputs;
}

export const CreateEventSessionQuestion = async ({
  eventId,
  sessionId,
  question,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
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