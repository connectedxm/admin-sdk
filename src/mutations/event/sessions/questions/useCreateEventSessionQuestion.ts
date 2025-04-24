import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionCreateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  EVENT_SESSION_QUESTIONS_QUERY_KEY,
  EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  question: EventSessionQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Events
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
      [eventId, sessionId, data.data.id.toString()],
      data
    );
    if (question.sectionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY(
          eventId,
          sessionId,
          question.sectionId.toString()
        ),
      });
    }

    if (question.questionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
          eventId,
          sessionId,
          question.questionId.toString()
        ),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
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
