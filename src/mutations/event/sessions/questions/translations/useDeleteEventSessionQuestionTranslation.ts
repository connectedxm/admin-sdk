import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface DeleteEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
export const DeleteEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY(
        eventId,
        sessionId,
        questionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group EventSession-Question-Translations
 */
export const useDeleteEventSessionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionTranslation>>,
      Omit<
        DeleteEventSessionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionTranslation>>
  >(DeleteEventSessionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
