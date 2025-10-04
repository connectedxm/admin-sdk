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
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface CreateEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
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

/**
 * @category Mutations
 * @group EventSession-Question-Translations
 */
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
  >(CreateEventSessionQuestionTranslation, options);
};
