import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
  sessionTranslation: EventSessionTranslation;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const UpdateEventSessionTranslation = async ({
  eventId,
  sessionId,
  sessionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventSessionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = sessionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`,
    body
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
  >(UpdateEventSessionTranslation, options);
};
