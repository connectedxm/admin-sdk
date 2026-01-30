import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionSectionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionSectionTranslation = async ({
  eventId,
  sessionId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionSectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        sectionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTION_TRANSLATION_QUERY_KEY(
        eventId,
        sessionId,
        sectionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionSectionTranslation>>,
      Omit<
        DeleteEventSessionSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionSectionTranslation>>
  >(DeleteEventSessionSectionTranslation, options);
};
