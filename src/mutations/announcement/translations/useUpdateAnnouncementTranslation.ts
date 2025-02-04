import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { AnnouncementTranslationUpdateInputs } from "@src/params";
import {
  ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY,
  SET_ANNOUNCEMENT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific announcement for a given locale.
 * This function allows for updating the translation details of an announcement, 
 * ensuring that the translation is correctly stored and the relevant queries are invalidated.
 * It is designed to be used in applications where announcements need to be localized.
 * @name PutAnnouncementTranslation
 * @param {string} announcementId - The ID of the announcement
 * @param {ISupportedLocale} locale - The locale for which the translation is being updated
 * @param {AnnouncementTranslationUpdateInputs} announcementTranslation - The translation details to update
 * @version 1.2
 **/

export interface UpdateAnnouncementTranslationParams extends MutationParams {
  announcementId: string;
  locale: ISupportedLocale;
  announcementTranslation: AnnouncementTranslationUpdateInputs;
}

export const UpdateAnnouncementTranslation = async ({
  announcementId,
  announcementTranslation,
  locale,
  queryClient,
  adminApiParams,
}: UpdateAnnouncementTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/announcements/${announcementId}/translations/${locale}`,
    announcementTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(announcementId),
    });
    SET_ANNOUNCEMENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [announcementId, data.data?.id],
      data
    );
  }
  return data;
};

export const useUpdateAnnouncementTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAnnouncementTranslation>>,
      Omit<
        UpdateAnnouncementTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAnnouncementTranslationParams,
    Awaited<ReturnType<typeof UpdateAnnouncementTranslation>>
  >(UpdateAnnouncementTranslation, options, {
    domain: "announcements",
    type: "update",
  });
};