import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, AnnouncementTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY,
  SET_ANNOUNCEMENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific announcement.
 * This function allows the creation of a translation for an announcement in a specified locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostAnnouncementTranslation
 * @param {string} announcementId (path) - The ID of the announcement
 * @param {string} locale (bodyValue) - The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) - Whether to auto-translate the content
 * @version 1.3
 **/

/**
 * @category Params
 * @announcement Announcements-Translations
 */
export interface CreateAnnouncementTranslationParams extends MutationParams {
  announcementId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @announcement Announcements-Translations
 */
export const CreateAnnouncementTranslation = async ({
  announcementId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateAnnouncementTranslationParams): Promise<
  ConnectedXMResponse<AnnouncementTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<AnnouncementTranslation>
  >(`/announcements/${announcementId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(announcementId),
    });
    SET_ANNOUNCEMENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [announcementId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @announcement Announcements-Translations
 */
export const useCreateAnnouncementTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAnnouncementTranslation>>,
      Omit<
        CreateAnnouncementTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAnnouncementTranslationParams,
    Awaited<ReturnType<typeof CreateAnnouncementTranslation>>
  >(CreateAnnouncementTranslation, options, {
    domain: "announcements",
    type: "update",
  });
};