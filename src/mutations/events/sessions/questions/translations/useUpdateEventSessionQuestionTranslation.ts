import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries/events/sessions/questions/translations";

/**
 * Updates the translation of a specific question within an event session.
 * This function allows for the modification of question translations in different locales for a given event session.
 * It is designed to be used in applications that manage multilingual content for event sessions.
 * @name UpdateEventSessionQuestionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sessionId (path) The ID of the session
 * @param {string} questionId (path) The ID of the question
 * @param {EventSessionQuestionTranslationUpdateInputs} sessionTranslation (body) The translation inputs for the session question
 * @param {ISupportedLocale} locale (path) The locale for the translation
 * @version 1.3
 */
export interface UpdateEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: ISupportedLocale;
  sessionTranslation: EventSessionQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const UpdateEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  sessionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations/${locale}`,
    sessionTranslation
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

/**
 * @category Mutations
 * @group Event-Sessions-Translations
 */
export const useUpdateEventSessionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestionTranslation>>,
      Omit<
        UpdateEventSessionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestionTranslation>>
  >(UpdateEventSessionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
