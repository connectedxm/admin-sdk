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
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface UpdateEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: ISupportedLocale;
  questionTranslation: EventSessionQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
export const UpdateEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  locale,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations/${locale}`,
    questionTranslation
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
 * @group EventSession-Question-Translations
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
