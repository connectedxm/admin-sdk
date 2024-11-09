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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
