import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionTranslation } from "@src/interfaces";
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
export interface CreateEventSessionTranslationParams extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const CreateEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionTranslationParams): Promise<
  ConnectedXMResponse<EventSessionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionTranslation>
  >(`/events/${eventId}/sessions/${sessionId}/translations`, {
    locale,
    autoTranslate,
  });
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
export const useCreateEventSessionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionTranslation>>,
      Omit<
        CreateEventSessionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionTranslation>>
  >(CreateEventSessionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
