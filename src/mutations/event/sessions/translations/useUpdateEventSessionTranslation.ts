import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions-Translations
 */
export interface UpdateEventSessionTranslationParams extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: ISupportedLocale;
  sessionTranslation: EventSessionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const UpdateEventSessionTranslation = async ({
  eventId,
  sessionId,
  sessionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`,
    sessionTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions-Translations
 */
export const useUpdateEventSessionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionTranslation>>,
      Omit<
        UpdateEventSessionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionTranslation>>
  >(UpdateEventSessionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
