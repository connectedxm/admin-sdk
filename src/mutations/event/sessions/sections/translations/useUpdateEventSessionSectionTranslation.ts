import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionSectionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionSectionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  locale: ISupportedLocale;
  sectionTranslation: EventSessionSectionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionSectionTranslation = async ({
  eventId,
  sessionId,
  sectionId,
  sectionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/translations/${locale}`,
    sectionTranslation
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
export const useUpdateEventSessionSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionSectionTranslation>>,
      Omit<
        UpdateEventSessionSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionSectionTranslation>>
  >(UpdateEventSessionSectionTranslation, options);
};
