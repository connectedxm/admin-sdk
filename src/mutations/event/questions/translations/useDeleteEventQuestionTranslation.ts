import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_TRANSLATIONS_QUERY_KEY,
  EVENT_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface DeleteEventQuestionTranslationParams extends MutationParams {
  eventId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const DeleteEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATION_QUERY_KEY(
        eventId,
        questionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useDeleteEventQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionTranslation>>,
      Omit<
        DeleteEventQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventQuestionTranslation>>
  >(DeleteEventQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
