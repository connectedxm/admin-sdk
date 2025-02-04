import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections-Translations
 */
export interface DeleteEventSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Sections-Translations
 */
export const DeleteEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSectionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections-Translations
 */
export const useDeleteEventSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSectionTranslation>>,
      Omit<
        DeleteEventSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSectionTranslation>>
  >(DeleteEventSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
