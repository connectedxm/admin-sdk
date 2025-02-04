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
 * @category Params
 * @announcement Announcements-Translations
 */
export interface UpdateAnnouncementTranslationParams extends MutationParams {
  announcementId: string;
  locale: ISupportedLocale;
  announcementTranslation: AnnouncementTranslationUpdateInputs;
}

/**
 * @category Methods
 * @announcement Announcements-Translations
 */
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

/**
 * @category Mutations
 * @announcement Announcements-Translations
 */
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
