import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY,
  ANNOUNCEMENT_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation of an announcement by its ID and locale.
 * This function is used to remove a translation for a given announcement, identified by its announcement ID and locale.
 * It is designed for applications that manage multilingual announcements and need to handle translation deletions.
 * @name DeleteAnnouncementTranslation
 * @param {string} announcementId (path) The ID of the announcement
 * @param {string} locale (path) The locale of the translation to be deleted
 * @version 1.3
 **/

/**
 * @category Params
 * @announcement Announcements-Translations
 */
export interface DeleteAnnouncementTranslationParams extends MutationParams {
  announcementId: string;
  locale: string;
}

/**
 * @category Methods
 * @announcement Announcements-Translations
 */
export const DeleteAnnouncementTranslation = async ({
  announcementId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteAnnouncementTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/announcements/${announcementId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(announcementId),
    });
    queryClient.invalidateQueries({
      queryKey: ANNOUNCEMENT_TRANSLATION_QUERY_KEY(announcementId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @announcement Announcements-Translations
 */
export const useDeleteAnnouncementTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAnnouncementTranslation>>,
      Omit<
        DeleteAnnouncementTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAnnouncementTranslationParams,
    Awaited<ReturnType<typeof DeleteAnnouncementTranslation>>
  >(DeleteAnnouncementTranslation, options, {
    domain: "announcements",
    type: "update",
  });
};
