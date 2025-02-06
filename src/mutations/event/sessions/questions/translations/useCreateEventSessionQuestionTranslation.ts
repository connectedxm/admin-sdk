import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries/events/sessions/questions/translations";

/**
 * Creates a new translation for a specific event session question.
 * This function allows the creation of a translation for a question within an event session, supporting multiple locales and optional auto-translation.
 * It is designed to be used in applications that manage multilingual event content.
 * @name PostEventSessionQuestionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sessionId (path) - The ID of the session
 * @param {string} questionId (path) - The ID of the question
 * @param {string} locale (bodyValue) - The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) - Whether to automatically translate the question
 * @version 1.3
 */
export interface CreateEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionTranslationParams): Promise<
  ConnectedXMResponse<EventSessionQuestionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventSessionQuestionTranslation>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    SET_EVENT_SESSION_QUESTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, data.data?.locale],
      data
    );
  }
  return data;
};

export const useCreateEventSessionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionQuestionTranslation>>,
      Omit<
        CreateEventSessionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionQuestionTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionQuestionTranslation>>
  >(CreateEventSessionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
