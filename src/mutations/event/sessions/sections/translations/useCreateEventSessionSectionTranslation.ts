import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionSectionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionSectionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionSectionTranslation = async ({
  eventId,
  sessionId,
  sectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionSectionTranslationParams): Promise<
  ConnectedXMResponse<EventSessionSectionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionSectionTranslation>
  >(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        sectionId
      ),
    });
    SET_EVENT_SESSION_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSessionSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionSectionTranslation>>,
      Omit<
        CreateEventSessionSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionSectionTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionSectionTranslation>>
  >(CreateEventSessionSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
