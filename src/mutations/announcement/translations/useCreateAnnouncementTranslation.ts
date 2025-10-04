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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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
  >(CreateAnnouncementTranslation, options);
};
